// Turns 1800.9 into "£ 1,800.90"
export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return "£ 0.00"
  return `£ ${Number(amount).toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}