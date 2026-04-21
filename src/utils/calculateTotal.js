// Calculates total for one item (qty × price)
export function calculateItemTotal(quantity, price) {
  return Number(quantity) * Number(price)
}

// Calculates grand total from all items
export function calculateInvoiceTotal(items) {
  return items.reduce((sum, item) => sum + item.total, 0)
}

// Calculates the paymentDue date from createdAt + paymentTerms
export function calculatePaymentDue(createdAt, paymentTerms) {
  const date = new Date(createdAt)
  date.setDate(date.getDate() + Number(paymentTerms))
  return date.toISOString().split("T")[0] // returns "YYYY-MM-DD"
}