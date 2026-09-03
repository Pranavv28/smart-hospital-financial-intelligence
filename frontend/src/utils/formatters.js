/**
 * Financial formatters for Smart Hospital Financial Intelligence
 */

/**
 * Formats a number as Indian Currency (₹) with standard commas.
 * e.g., 145900 -> "₹1,45,900"
 */
export function formatINR(amount, options = {}) {
  const { decimals = 0, showSign = false } = options;
  if (amount === undefined || amount === null || isNaN(amount)) return "₹0";

  const num = Number(amount);
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(absNum);

  if (isNegative) {
    return `-₹${formatted}`;
  }
  return showSign && num > 0 ? `+₹${formatted}` : `₹${formatted}`;
}

/**
 * Formats large amounts into Indian Lakhs (L) and Crores (Cr).
 * e.g., 24000000 -> "₹2.40 Cr", 1800000 -> "₹18.00 L", 32600 -> "₹32.6 K"
 */
export function formatCompactINR(amount, options = {}) {
  const { decimals = 2, showSign = false } = options;
  if (amount === undefined || amount === null || isNaN(amount)) return "₹0";

  const num = Number(amount);
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  let result = "";
  if (absNum >= 10000000) {
    // 1 Crore = 10,000,000
    const cr = (absNum / 10000000).toFixed(decimals);
    result = `₹${parseFloat(cr)} Cr`;
  } else if (absNum >= 100000) {
    // 1 Lakh = 100,000
    const l = (absNum / 100000).toFixed(decimals);
    result = `₹${parseFloat(l)} L`;
  } else if (absNum >= 1000) {
    const k = (absNum / 1000).toFixed(1);
    result = `₹${parseFloat(k)} K`;
  } else {
    result = `₹${absNum.toLocaleString("en-IN")}`;
  }

  if (isNegative) {
    return `-${result}`;
  }
  return showSign && num > 0 ? `+${result}` : result;
}

/**
 * Formats percentages.
 * e.g., 90 -> "90.0%", -12.4 -> "-12.4%"
 */
export function formatPercentage(value, options = {}) {
  const { decimals = 1, showSign = false } = options;
  if (value === undefined || value === null || isNaN(value)) return "0%";

  const num = Number(value);
  const formatted = num.toFixed(decimals);
  if (showSign && num > 0) {
    return `+${formatted}%`;
  }
  return `${formatted}%`;
}
