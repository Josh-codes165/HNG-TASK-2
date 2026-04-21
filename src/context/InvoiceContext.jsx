import { createContext, useContext, useState, useEffect } from "react"
import { loadInvoices, saveInvoices } from "../utils/storage"
import { generateId } from "../utils/generateId"
import { calculateInvoiceTotal, calculatePaymentDue } from "../utils/calculateTotal"

// 1. Create the context
const InvoiceContext = createContext()

// 2. Create the Provider
export function InvoiceProvider({ children }) {
  // Load invoices from localStorage on first render
  const [invoices, setInvoices] = useState(() => loadInvoices())
  


  // Whenever invoices change, save to localStorage automatically
  useEffect(() => {
    saveInvoices(invoices)
  }, [invoices])

  // ── CREATE ──────────────────────────────────────────
  function addInvoice(formData, status = "pending") {
    const newInvoice = {
      ...formData,
      id: generateId(),
      status,
      createdAt: formData.createdAt || new Date().toISOString().split("T")[0],
      paymentDue: calculatePaymentDue(
        formData.createdAt || new Date().toISOString().split("T")[0],
        formData.paymentTerms
      ),
      total: calculateInvoiceTotal(formData.items || []),
    }
    setInvoices(prev => [newInvoice, ...prev])
    return newInvoice.id
  }

  // ── UPDATE ──────────────────────────────────────────
  function updateInvoice(id, formData) {
    setInvoices(prev =>
      prev.map(invoice =>
        invoice.id === id
          ? {
              ...invoice,
              ...formData,
              paymentDue: calculatePaymentDue(
                formData.createdAt,
                formData.paymentTerms
              ),
              total: calculateInvoiceTotal(formData.items || []),
            }
          : invoice
      )
    )
  }

  // ── DELETE ──────────────────────────────────────────
  function deleteInvoice(id) {
    setInvoices(prev => prev.filter(invoice => invoice.id !== id))
  }

  // ── MARK AS PAID ────────────────────────────────────
  function markAsPaid(id) {
    setInvoices(prev =>
      prev.map(invoice =>
        invoice.id === id ? { ...invoice, status: "paid" } : invoice
      )
    )
  }

  // ── GET ONE INVOICE ─────────────────────────────────
  function getInvoice(id) {
    return invoices.find(invoice => invoice.id === id)
  }

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        markAsPaid,
        getInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  )
}

// 3. Custom hook
export function useInvoices() {
  return useContext(InvoiceContext)
}