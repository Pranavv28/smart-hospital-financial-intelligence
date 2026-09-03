import {
  computeDashboardStats,
  computeLeakage,
  computeDepartmentProfitability,
  computeRevenueTrend,
  computeRoi,
} from "../utils/analytics.js";

// In-memory working copy of seed data
let cachedSeedData = null;

/**
 * Loads the seed data from backend API or fallback to static seed JSON.
 * @returns {Promise<Object>}
 */
export async function getSeedData() {
  if (cachedSeedData) {
    return cachedSeedData;
  }

  try {
    const response = await fetch("/api/analytics/seed");
    if (response.ok) {
      cachedSeedData = await response.json();
      return cachedSeedData;
    }
  } catch {
    // API not active, fall back
  }

  try {
    const response = await fetch("/data/seed.json");
    if (response.ok) {
      cachedSeedData = await response.json();
      return cachedSeedData;
    }
  } catch {
    // Fallback if running client-side bundle
  }

  return cachedSeedData || {};
}

/**
 * Sets seed data explicitly in memory.
 * @param {Object} data
 */
export function setSeedData(data) {
  cachedSeedData = JSON.parse(JSON.stringify(data));
}

/**
 * Resolves a leakage discrepancy by adding the missing service to the admission's invoice
 * (Simulating 1-click billing resolution in the live demo).
 * @param {string} admissionId
 * @param {string} serviceId
 * @returns {Promise<Object>} updated seed data
 */
export async function resolveLeakageAnomaly(admissionId, serviceId) {
  const data = await getSeedData();
  const service = (data.services || []).find((s) => s.id === serviceId);
  const servicePrice = Number(service?.price) || 0;

  // Find or create invoice for this admission
  let invoice = (data.invoices || []).find((inv) => inv.admission_id === admissionId);

  if (invoice) {
    if (!invoice.service_ids.includes(serviceId)) {
      invoice.service_ids.push(serviceId);
      invoice.subtotal = (Number(invoice.subtotal) || 0) + servicePrice;
      invoice.total = (Number(invoice.total) || 0) + servicePrice;
    }
  } else {
    // Create new invoice if none exists
    const newInvId = `inv_auto_${Date.now()}`;
    const newInvoice = {
      id: newInvId,
      admission_id: admissionId,
      service_ids: [serviceId],
      subtotal: servicePrice,
      discount: 0,
      total: servicePrice,
    };
    data.invoices = [...(data.invoices || []), newInvoice];
  }

  cachedSeedData = { ...data };
  return cachedSeedData;
}

/**
 * Resets seed data back to initial fetch state.
 */
export async function resetSeedData() {
  cachedSeedData = null;
  return await getSeedData();
}

/**
 * Dashboard stats getter with service logic.
 * @param {Object} [overrideSeed]
 */
export async function getDashboardData(overrideSeed) {
  const seedData = overrideSeed || (await getSeedData());
  const stats = computeDashboardStats(seedData);
  const deptProfitability = computeDepartmentProfitability(seedData);
  const revenueTrend = computeRevenueTrend(seedData);

  return {
    ...stats,
    deptProfitability,
    revenueTrend,
  };
}

/**
 * Leakage alerts getter.
 * @param {Object} [overrideSeed]
 */
export async function getLeakageAlerts(overrideSeed) {
  const seedData = overrideSeed || (await getSeedData());
  return computeLeakage(seedData);
}

export { computeRoi };
