const fs = require('fs');
const path = require('path');

// Import analytics functions
const analyticsPath = path.join(__dirname, '..', 'frontend', 'src', 'utils', 'analytics.js');

// Helper to load seed.json
const seedPath = path.join(__dirname, 'seed.json');
const rawData = fs.readFileSync(seedPath, 'utf-8');
const seedData = JSON.parse(rawData);

// Dynamic import or evaluation of analytics.js in Node
const analyticsCode = fs.readFileSync(analyticsPath, 'utf-8');

// Simple ES module simulator for Node environment without type: module
const context = {};
const wrappedCode = analyticsCode
  .replace(/export function /g, 'function ')
  .replace(/export {[^}]*};/g, '');

const evalFn = new Function('context', `
  ${wrappedCode}
  context.computeLeakage = computeLeakage;
  context.computeDashboardStats = computeDashboardStats;
  context.computeDepartmentProfitability = computeDepartmentProfitability;
  context.computeRevenueTrend = computeRevenueTrend;
  context.computeRoi = computeRoi;
`);

evalFn(context);

console.log("=== TESTING TRACK A SHARED ANALYTICS UTILITIES ===");

// Test 1: computeLeakage
const leakageAlerts = context.computeLeakage(seedData);
console.log("\n[TEST 1] computeLeakage(seedData):");
console.log(`- Found ${leakageAlerts.length} revenue leakage alerts`);
leakageAlerts.forEach((alert, i) => {
  console.log(`  Alert ${i+1}: Admission ${alert.admissionId} - ${alert.serviceName} (${alert.department}) - Impact: ₹${alert.impact.toLocaleString()}`);
});

// Test 2: computeDashboardStats
const stats = context.computeDashboardStats(seedData);
console.log("\n[TEST 2] computeDashboardStats(seedData):");
console.log(`- Total Revenue: ₹${stats.totalRevenue.toLocaleString()}`);
console.log(`- Total Expenses: ₹${stats.totalExpenses.toLocaleString()}`);
console.log(`- Net Profit: ₹${stats.netProfit.toLocaleString()}`);
console.log(`- Outstanding Receivables: ₹${stats.outstandingReceivables.toLocaleString()}`);
console.log(`- Potential Revenue Leakage: ₹${stats.potentialLeakage.toLocaleString()}`);
console.log(`- Total Leakage Alerts: ${stats.leakageCount}`);

// Test 3: computeDepartmentProfitability
const deptProfitability = context.computeDepartmentProfitability(seedData);
console.log("\n[TEST 3] computeDepartmentProfitability(seedData):");
deptProfitability.forEach((d) => {
  console.log(`  Department: ${d.department} | Revenue: ₹${d.revenue.toLocaleString()} | Expenses: ₹${d.expenses.toLocaleString()} | Profit: ₹${d.profit.toLocaleString()}`);
});

// Test 4: computeRevenueTrend
const trend = context.computeRevenueTrend(seedData);
console.log("\n[TEST 4] computeRevenueTrend(seedData):");
trend.forEach((t) => {
  console.log(`  Month: ${t.month} | Revenue: ₹${t.revenue.toLocaleString()} | Expenses: ₹${t.expenses.toLocaleString()}`);
});

// Test 5: computeRoi
const roi = context.computeRoi(24000000, 450, 8000, 1800000);
console.log("\n[TEST 5] computeRoi worked example:");
console.log(`  Monthly Revenue: ₹${roi.monthlyRevenue.toLocaleString()}`);
console.log(`  Monthly Contribution: ₹${roi.monthlyContribution.toLocaleString()}`);
console.log(`  Annual Contribution: ₹${roi.annualContribution.toLocaleString()}`);
console.log(`  Break-even: ${roi.breakEvenYears} years`);
console.log(`  ROI: ${roi.roiPercentage}%`);

// Assertions
if (leakageAlerts.length >= 1 && stats.totalRevenue > 0 && stats.potentialLeakage > 0) {
  console.log("\n✅ ALL TESTS PASSED SUCCESSFULLY!");
} else {
  console.error("\n❌ TESTS FAILED!");
  process.exit(1);
}
