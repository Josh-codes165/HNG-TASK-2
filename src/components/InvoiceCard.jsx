import { useNavigate } from "react-router-dom"
import StatusBadge from "./StatusBadge"
import { formatDate } from "../utils/formatDate"
import { formatCurrency } from "../utils/formatCurrency"
import "./InvoiceCard.css"

export default function InvoiceCard({ invoice }) {
  const navigate = useNavigate()

  return (
    <article
      className="invoice-card"
      onClick={() => navigate(`/invoices/${invoice.id}`)}
      role="button"
      tabIndex={0}
      aria-label={`View invoice ${invoice.id} for ${invoice.clientName}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          navigate(`/invoices/${invoice.id}`)
        }
      }}
    >
      {/* Invoice ID */}
      <span className="invoice-card__id">
        <span aria-hidden="true">#</span>{invoice.id}
      </span>

      {/* Due date */}
      <span className="invoice-card__due">
        Due {formatDate(invoice.paymentDue)}
      </span>

      {/* Client name */}
      <span className="invoice-card__client">{invoice.clientName}</span>

      {/* Total */}
      <span className="invoice-card__total">
        {formatCurrency(invoice.total)}
      </span>

      {/* Status badge */}
      <StatusBadge status={invoice.status} />

      {/* Arrow icon */}
      <svg
        className="invoice-card__arrow"
        xmlns="http://www.w3.org/2000/svg"
        width="7"
        height="10"
        viewBox="0 0 7 10"
        aria-hidden="true"
      >
        <path
          d="M1 1l4 4-4 4"
          stroke="#7C5DFA"
          strokeWidth="2"
          fill="none"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </article>
  )
}