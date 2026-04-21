const STORAGE_KEY = "invoice-app-data"

// Load all invoices from localStorage
export function loadInvoices() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Failed to load invoices:", error)
    return []
  }
}

// Save all invoices to localStorage
export function saveInvoices(invoices) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
  } catch (error) {
    console.error("Failed to save invoices:", error)
  }
}