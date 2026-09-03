/**
 * Shared analytics utilities for Smart Hospital Financial Intelligence
 */

/**
 * Computes revenue leakage alerts by comparing completed services in admissions
 * against service items billed in invoices.
 *
 * @param {Object} seedData
 * @returns {Array<{admissionId: string, serviceId: string, serviceName: string, department: string, impact: number, reason: string}>}
 */
export function computeLeakage(seedData = {}) {
  const servicesById = new Map(
    (seedData.services || []).map((service) => [service.id, service])
  );
  const patientsById = new Map(
    (seedData.patients || []).map((p) => [p.id, p])
  );
  const invoicesByAdmissionId = new Map();

  for (const invoice of seedData.invoices || []) {
    const billedServiceIds = invoicesByAdmissionId.get(invoice.admission_id) || new Set();
    for (const serviceId of invoice.service_ids || []) {
      billedServiceIds.add(serviceId);
    }
    invoicesByAdmissionId.set(invoice.admission_id, billedServiceIds);
  }

  return (seedData.admissions || []).flatMap((admission) => {
    const billedServiceIds = invoicesByAdmissionId.get(admission.id) || new Set();
    const patient = patientsById.get(admission.patient_id);

    return (admission.service_ids || [])
      .filter((serviceId) => !billedServiceIds.has(serviceId))
      .map((serviceId) => {
        const service = servicesById.get(serviceId);
        return {
          admissionId: admission.id,
          patientId: admission.patient_id,
          patientName: patient?.name || `Patient (${admission.patient_id})`,
          serviceId,
          serviceName: service?.name || serviceId,
          department: service?.department || "General",
          impact: Number(service?.price) || 0,
          reason: "Completed clinical service omitted from final patient invoice",
          date: admission.date || "2026-08-10",
        };
      });
  });
}

/**
 * Computes top-level KPI metrics for the hospital dashboard.
 *
 * @param {Object} seedData
 * @returns {{totalRevenue: number, totalExpenses: number, netProfit: number, outstandingReceivables: number, potentialLeakage: number, leakageCount: number}}
 */
export function computeDashboardStats(seedData = {}) {
  const invoices = seedData.invoices || [];
  const paymentsByInvoiceId = new Map();

  for (const payment of seedData.payments || []) {
    const received = paymentsByInvoiceId.get(payment.invoice_id) || 0;
    paymentsByInvoiceId.set(payment.invoice_id, received + (Number(payment.amount) || 0));
  }

  const totalRevenue = invoices.reduce(
    (total, invoice) => total + (Number(invoice.total) || 0),
    0
  );

  const totalExpenses = (seedData.expenses || []).reduce(
    (total, expense) => total + (Number(expense.amount) || 0),
    0
  );

  const outstandingReceivables = invoices.reduce((total, invoice) => {
    const paid = paymentsByInvoiceId.get(invoice.id) || 0;
    return total + Math.max(0, (Number(invoice.total) || 0) - paid);
  }, 0);

  const leakageAlerts = computeLeakage(seedData);
  const potentialLeakage = leakageAlerts.reduce((total, alert) => total + alert.impact, 0);

  return {
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    outstandingReceivables,
    potentialLeakage,
    leakageCount: leakageAlerts.length,
    leakageAlerts,
  };
}

/**
 * Computes Revenue vs Expenses aggregated by Department.
 *
 * @param {Object} seedData
 * @returns {Array<{department: string, revenue: number, expenses: number, profit: number}>}
 */
export function computeDepartmentProfitability(seedData = {}) {
  const servicesById = new Map(
    (seedData.services || []).map((s) => [s.id, s])
  );

  const deptRevenue = new Map();
  const deptExpenses = new Map();

  // Aggregate Revenue per department from invoices
  for (const invoice of seedData.invoices || []) {
    for (const serviceId of invoice.service_ids || []) {
      const service = servicesById.get(serviceId);
      if (service) {
        const dept = service.department || "General";
        const current = deptRevenue.get(dept) || 0;
        deptRevenue.set(dept, current + (Number(service.price) || 0));
      }
    }
  }

  // Aggregate Expenses per department
  for (const expense of seedData.expenses || []) {
    const dept = expense.department || "General";
    const current = deptExpenses.get(dept) || 0;
    deptExpenses.set(dept, current + (Number(expense.amount) || 0));
  }

  // Get all unique departments
  const allDepts = new Set([...deptRevenue.keys(), ...deptExpenses.keys()]);

  return Array.from(allDepts).map((dept) => {
    const revenue = deptRevenue.get(dept) || 0;
    const expenses = deptExpenses.get(dept) || 0;
    return {
      department: dept,
      revenue,
      expenses,
      profit: revenue - expenses,
    };
  });
}

/**
 * Computes monthly historical revenue and expense trend.
 *
 * @param {Object} seedData
 * @returns {Array<{month: string, revenue: number, expenses: number}>}
 */
export function computeRevenueTrend(seedData = {}) {
  const monthlyData = new Map();

  const getMonthKey = (dateStr) => {
    if (!dateStr) return "2026-08";
    return dateStr.substring(0, 7); // "YYYY-MM"
  };

  const admissionsById = new Map(
    (seedData.admissions || []).map((a) => [a.id, a])
  );

  // Invoices -> Month based on admission date or payment
  for (const invoice of seedData.invoices || []) {
    const admission = admissionsById.get(invoice.admission_id);
    const month = getMonthKey(admission?.date);

    const current = monthlyData.get(month) || { month, revenue: 0, expenses: 0 };
    current.revenue += Number(invoice.total) || 0;
    monthlyData.set(month, current);
  }

  // Expenses -> Month
  for (const expense of seedData.expenses || []) {
    const month = expense.month || "2026-08";
    const current = monthlyData.get(month) || { month, revenue: 0, expenses: 0 };
    current.expenses += Number(expense.amount) || 0;
    monthlyData.set(month, current);
  }

  return Array.from(monthlyData.values()).sort((a, b) =>
    a.month.localeCompare(b.month)
  );
}

/**
 * Computes ROI Simulator values.
 *
 * @param {number} investment - Total investment cost in INR
 * @param {number} volume - Monthly patient volume
 * @param {number} avgRevenue - Average revenue per patient in INR
 * @param {number} opCost - Monthly operating & maintenance cost in INR
 * @returns {{monthlyRevenue: number, monthlyContribution: number, annualContribution: number, breakEvenYears: number, roiPercentage: number}}
 */
export function computeRoi(investment, volume, avgRevenue, opCost) {
  const inv = Number(investment) || 0;
  const vol = Number(volume) || 0;
  const rev = Number(avgRevenue) || 0;
  const cost = Number(opCost) || 0;

  const monthlyRevenue = vol * rev;
  const monthlyContribution = monthlyRevenue - cost;
  const annualContribution = monthlyContribution * 12;

  const breakEvenYears =
    annualContribution > 0 ? Number((inv / annualContribution).toFixed(2)) : 0;
  const roiPercentage =
    inv > 0 ? Number(((annualContribution / inv) * 100).toFixed(1)) : 0;

  return {
    monthlyRevenue,
    monthlyContribution,
    annualContribution,
    breakEvenYears,
    roiPercentage,
  };
}
