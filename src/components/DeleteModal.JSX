import { useEffect, useRef } from "react"
import "./DeleteModal.css"

export default function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  const cancelBtnRef = useRef(null)
  const modalRef = useRef(null)

  // Focus the cancel button when modal opens (accessibility)
  useEffect(() => {
    cancelBtnRef.current?.focus()
  }, [])

  // Close on ESC key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onCancel()

      // Focus trap — keep Tab inside modal
      if (e.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable || focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          // Shift+Tab going backwards
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          // Tab going forwards
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
    // Backdrop
    <div
      className="modal-backdrop"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Modal box — stop click from bubbling to backdrop */}
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