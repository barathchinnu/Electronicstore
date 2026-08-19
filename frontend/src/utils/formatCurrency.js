/**
 * Format number as Indian Rupees
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format number with Indian comma style (no currency symbol)
 */
export const formatNumber = (amount) => {
  return new Intl.NumberFormat('en-IN').format(amount);
};

/**
 * Calculate discount percentage
 */
export const calcDiscount = (originalPrice, price) => {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};
