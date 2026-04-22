import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useInvoices } from "../context/InvoiceContext"
import StatusBadge from "../components/StatusBadge"
import DeleteModal from "../components/DeleteModal.jsx"
import { formatDate } from "../utils/formatDate"
import { formatCurrency } from "../utils/formatCurrency"
import "./InvoiceDetailPage.css"

export default function InvoiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getInvoice, deleteInvoice, markAsPaid } = useInvoices()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const invoice = getInvoice(id)

  // If invoice not found, show a friendly message
  if (!invoice) {
    return (
      <div className="detail-not-found">
        <button
          className="detail__back-btn"
          onClick={() => navigate("/invoices")}
        >
          <BackArrow /> Go back
        </button>
        <p>Invoice not found.</p>
      </div>
    )
  }

  function handleDelete() {
    deleteInvoice(id)
    navigate("/invoices")
  }

  function handleMarkAsPaid() {
    markAsPaid(id)
  }

  return (
    <div className="detail">

      {/* Back button */}
      <button
        className="detail__back-btn"
        onClick={() => navigate(-1)}
        aria-label="Go back to invoice list"
      >
        <BackArrow /> Go back
      </button>

      {/* Status bar */}
      <div className="detail__status-bar">
        <div className="detail__status-left">
          <span className="detail__status-label">Status</span>
          <StatusBadge status={invoice.status} />
        </div>

        {/* Action buttons — desktop */}
        <div className="detail__actions" role="group" aria-label="Invoice actions">
          <button
            className="detail__btn detail__btn--edit"
            onClick={() => navigate(`/invoices/${id}/edit`)}
            disabled={invoice.status === "paid"}
            aria-label="Edit invoice"
          >
            Edit
          </button>

          <button
            className="detail__btn detail__btn--delete"
            onClick={() => setShowDeleteModal(true)}
            aria-label="Delete invoice"
          >
            Delete
          </button>

          {invoice.status === "pending" && (
            <button
              className="detail__btn detail__btn--paid"
              onClick={handleMarkAsPaid}
              aria-label="Mark invoice as paid"
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* Invoice info card */}
      <div className="detail__card">

        {/* Top: ID + description + sender address */}
        <div className="detail__card-top">
          <div>
            <p className="detail__invoice-id">
              <span aria-hidden="true">#</span>{invoice.id}
            </p>
            <p className="detail__description">{invoice.description}</p>
          </div>

          <address className="detail__sender-address">
            <span>{invoice.senderAddress?.street}</span>
            <span>{invoice.senderAddress?.city}</span>
            <span>{invoice.senderAddress?.postCode}</span>
            <span>{invoice.senderAddress?.country}</span>
          </address>
        </div>

        {/* Middle: dates + client info */}
        <div className="detail__card-middle">

          {/* Invoice Date */}
          <div className="detail__info-group">
            <p className="detail__info-label">Invoice Date</p>
            <p className="detail__info-value">{formatDate(invoice.createdAt)}</p>
          </div>

          {/* Bill To */}
          <div className="detail__info-group detail__bill-to">
            <p className="detail__info-label">Bill To</p>
            <p className="detail__info-value detail__client-name">
              {invoice.clientName}
            </p>
            <address className="detail__client-address">
              <span>{invoice.clientAddress?.street}</span>
              <span>{invoice.clientAddress?.city}</span>
              <span>{invoice.clientAddress?.postCode}</span>
              <span>{invoice.clientAddress?.country}</span>
            </address>
          </div>

          {/* Payment Due */}
          <div className="detail__info-group">
            <p className="detail__info-label">Payment Due</p>
            <p className="detail__info-value">{formatDate(invoice.paymentDue)}</p>
          </div>

          {/* Sent To (email) */}
          <div className="detail__info-group">
            <p className="detail__info-label">Sent To</p>
            <p className="detail__info-value">{invoice.clientEmail}</p>
          </div>

        </div>

        {/* Items table */}
        <div className="detail__items">
          <table className="detail__table" aria-label="Invoice items">
            <thead className="detail__table-head">
              <tr>
                <th scope="col">Item Name</th>
                <th scope="col" className="text-right">QTY.</th>
                <th scope="col" className="text-right">Price</th>
                <th scope="col" className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map(item => (
                <tr key={item.id} className="detail__table-row">
                  <td className="detail__item-name">{item.name}</td>
                  <td className="detail__item-qty text-right">
                    {item.quantity}
                  </td>
                  <td className="detail__item-price text-right">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="detail__item-total text-right">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Grand Total */}
          <div className="detail__grand-total">
            <p className="detail__grand-label">Amount Due</p>
            <p className="detail__grand-amount">
              {formatCurrency(invoice.total)}
            </p>
          </div>
        </div>

      </div>

      {/* Mobile action buttons */}
      <div className="detail__mobile-actions">
        <button
          className="detail__btn detail__btn--edit"
          onClick={() => navigate(`/invoices/${id}/edit`)}
          disabled={invoice.status === "paid"}
        >
          Edit
        </button>
        <button
          className="detail__btn detail__btn--delete"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete
        </button>
        {invoice.status === "pending" && (
          <button
            className="detail__btn detail__btn--paid"
            onClick={handleMarkAsPaid}
          >
            Mark as Paid
          </button>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

    </div>
  )
}

// Back arrow SVG
function BackArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="7"
      height="10"
      viewBox="0 0 7 10"
      aria-hidden="true"
    >
      <path
        d="M6 1L2 5l4 4"
        stroke="#7C5DFA"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}