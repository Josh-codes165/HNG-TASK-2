import "./EmptyState.css"
import  None from '../assets/None.png'

export default function EmptyState({ isFiltered }) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <img src={None} alt="" style={{
        width : "242",
        height :"200"
      }}/>
      {/* Illustration */}
      {/* <svg
        className="empty-state__illustration"
        xmlns="http://www.w3.org/2000/svg"
        width="242"
        height="200"
        viewBox="0 0 242 200"
        aria-hidden="true"
      >
        <g fill="none" fillRule="evenodd">
          <circle cx="121" cy="100" r="80" fill="var(--color-card)" />
          <g fillRule="nonzero">
            <path
              d="M121 60l-30 20v40l30 20 30-20V80z"
              fill="var(--color-purple)"
              opacity=".1"
            />
            <path
              d="M121 60l30 20-30 20-30-20z"
              fill="var(--color-purple)"
              opacity=".5"
            />
            <path
              d="M91 80v40l30 20V100z"
              fill="var(--color-purple)"
              opacity=".3"
            />
            <path
              d="M151 80v40l-30 20V100z"
              fill="var(--color-purple)"
            />
          </g>
        </g>
      </svg> */}

      <h2 className="empty-state__title">Nothing here</h2>

      <p className="empty-state__text">
        {isFiltered
          ? "No invoices match your current filter. Try selecting a different status."
          : "Create an invoice by clicking the New Invoice button and get started."}
      </p>
    </div>
  )
}