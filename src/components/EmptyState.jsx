import None from "../assets/None.png"

export default function EmptyState({ isFiltered }) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <img src={None} alt=""
      // width="242"
        // height="200"
        viewBox="0 0 242 200"
        aria-hidden="true"
        className="empty-state__illustration"
        />

      <h2 className="empty-state__title">Nothing here</h2>
      <p className="empty-state__text">
        {isFiltered
          ? "No invoices match your current filter. Try selecting a different status."
          : "Create an invoice by clicking the New Invoice button and get started."}
      </p>
    </div>
  )
}