import { useEffect, useRef } from "react"
import "./DeleteModal.css"

export default function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  const cancelBtnRef = useRef(null)
  const modalRef = useRef(null)

  useEffect(() => {
    cancelBtnRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onCancel()

      if (e.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable || focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onCancel])

  return (
    <div
      className="modal-backdrop"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        className="modal"
        ref={modalRef}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="modal__title" id="modal-title">
          Confirm Deletion
        </h2>

        <p className="modal__description" id="modal-description">
          Are you sure you want to delete invoice{" "}
          <strong>#{invoiceId}</strong>? This action cannot be undone.
        </p>

        <div className="modal__actions">
          <button
            className="modal__btn modal__btn--cancel"
            onClick={onCancel}
            ref={cancelBtnRef}
          >
            Cancel
          </button>

          <button
            className="modal__btn modal__btn--delete"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}