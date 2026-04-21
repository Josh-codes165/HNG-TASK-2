import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useInvoices } from "../context/InvoiceContext"
import InvoiceCard from "../components/InvoiceCard"
import EmptyState from "../components/EmptyState"
import FilterDropdown from "../components/FilterDropdown"
import "./InvoiceListPage.css"

export default function InvoiceListPage() {
  const { invoices } = useInvoices()
  const navigate = useNavigate()
  const [activeFilters, setActiveFilters] = useState([])

  // Derive filtered list — if no filters selected, show all
  const filteredInvoices = activeFilters.length === 0
    ? invoices
    : invoices.filter(inv => activeFilters.includes(inv.status))

  // Subtitle text
  function getSubtitle() {
    const count = filteredInvoices.length
    if (window.innerWidth < 768) {
      return `${count} invoice${count !== 1 ? "s" : ""}`
    }
    if (count === 0) return "No invoices"
    return `There are ${count} total invoice${count !== 1 ? "s" : ""}`
  }

  return (
    <div className="invoice-list-page">
      {/* Header */}
      <header className="invoice-list-page__header">
        <div className="invoice-list-page__title-group">
          <h1 className="invoice-list-page__title">Invoices</h1>
          <p className="invoice-list-page__subtitle" aria-live="polite">
            {getSubtitle()}
          </p>
        </div>

        <div className="invoice-list-page__actions">
          <FilterDropdown
            activeFilters={activeFilters}
            onChange={setActiveFilters}
          />

          {/* New Invoice Button */}
          <button
            className="btn-new-invoice"
            onClick={() => navigate("/invoices/new")}
            aria-label="Create new invoice"
          >
            <span className="btn-new-invoice__icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11">
                <path
                  d="M6.313 10.023V6.313h3.71V4.687h-3.71V.977H4.687v3.71H.977v1.626h3.71v3.71z"
                  fill="#7C5DFA"
                  fillRule="nonzero"
                />
              </svg>
            </span>
            New <span className="btn-new-invoice__label--desktop"> Invoice</span>
          </button>
        </div>
      </header>

      {/* Invoice List or Empty State */}
      <section aria-label="Invoice list">
        {filteredInvoices.length === 0 ? (
          <EmptyState isFiltered={activeFilters.length > 0} />
        ) : (
          <ul className="invoice-list" role="list">
            {filteredInvoices.map(invoice => (
              <li key={invoice.id}>
                <InvoiceCard invoice={invoice} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}