import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInvoices } from "../context/InvoiceContext";
import { initialFormState, initialItem } from "../utils/initialFormState";
import { validateForm, hasErrors } from "../utils/validateForm";
import { calculateItemTotal } from "../utils/calculateTotal";
import { formatCurrency } from "../utils/formatCurrency";
import "./InvoiceFormPage.css";

export default function InvoiceFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getInvoice, addInvoice, updateInvoice } = useInvoices();

  const isEditMode = Boolean(id);
  const existingInvoice = isEditMode ? getInvoice(id) : null;

  // Initialise form — pre-fill if editing
  const [formData, setFormData] = useState(() => {
    if (isEditMode && existingInvoice) {
      return { ...existingInvoice };
    }
    return { ...initialFormState };
  });

  const [errors, setErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Re-validate on every change if user has already tried submitting
  useEffect(() => {
    if (submitAttempted) {
      setErrors(validateForm(formData));
    }
  }, [formData, submitAttempted]);

  // ── FIELD UPDATERS ─────────────────────────────────

  function updateField(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function updateSenderAddress(field, value) {
    setFormData((prev) => ({
      ...prev,
      senderAddress: { ...prev.senderAddress, [field]: value },
    }));
  }

  function updateClientAddress(field, value) {
    setFormData((prev) => ({
      ...prev,
      clientAddress: { ...prev.clientAddress, [field]: value },
    }));
  }

  // ── ITEM MANAGEMENT ────────────────────────────────

  function addItem() {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...initialItem, id: `item-${Date.now()}` }],
    }));
  }

  function updateItem(index, field, value) {
    setFormData((prev) => {
      const updatedItems = prev.items.map((item, i) => {
        if (i !== index) return item;

        const updatedItem = { ...item, [field]: value };

        // Auto-calculate total when qty or price changes
        if (field === "quantity" || field === "price") {
          updatedItem.total = calculateItemTotal(
            field === "quantity" ? value : item.quantity,
            field === "price" ? value : item.price,
          );
        }

        return updatedItem;
      });

      return { ...prev, items: updatedItems };
    });
  }

  function removeItem(index) {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }

  // ── SUBMISSION ─────────────────────────────────────

  function handleSaveAsDraft() {
    // Drafts only need at least a client name
    if (!formData.clientName.trim()) {
      setErrors({ clientName: "Client name is required to save as draft" });
      setSubmitAttempted(true);
      return;
    }
    addInvoice(formData, "draft");
    navigate("/invoices");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitAttempted(true);

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) return;

    if (isEditMode) {
      updateInvoice(id, formData);
    } else {
      addInvoice(formData, "pending");
    }

    navigate("/invoices");
  }

  function handleDiscard() {
    navigate(-1);
  }

  // ── RENDER ─────────────────────────────────────────

  return (
    <div className="form-page">
      <button
        className="form-page__back-btn"
        onClick={handleDiscard}
        type="button"
        aria-label="Go back"
      >
        <BackArrow /> Go back
      </button>

      <h1 className="form-page__title">
        {isEditMode ? (
          <>
            Edit <span aria-hidden="true">#</span>
            {id}
          </>
        ) : (
          "New Invoice"
        )}
      </h1>

      <form
        className="form"
        onSubmit={handleSubmit}
        noValidate
        aria-label={isEditMode ? "Edit invoice form" : "Create invoice form"}
      >
        {/* ── BILL FROM ── */}
        <fieldset className="form__fieldset">
          <legend className="form__legend">Bill From</legend>

          <div className="form__group form__group--full">
            <label className="form__label" htmlFor="senderStreet">
              Street Address
            </label>
            <input
              id="senderStreet"
              className={`form__input ${errors["senderAddress.street"] ? "form__input--error" : ""}`}
              type="text"
              value={formData.senderAddress.street}
              onChange={(e) => updateSenderAddress("street", e.target.value)}
              aria-describedby={
                errors["senderAddress.street"]
                  ? "senderStreet-error"
                  : undefined
              }
              aria-invalid={Boolean(errors["senderAddress.street"])}
            />
            {errors["senderAddress.street"] && (
              <span
                className="form__error"
                id="senderStreet-error"
                role="alert"
              >
                {errors["senderAddress.street"]}
              </span>
            )}
          </div>

          <div className="form__row form__row--3">
            <div className="form__group">
              <label className="form__label" htmlFor="senderCity">
                City
              </label>
              <input
                id="senderCity"
                className={`form__input ${errors["senderAddress.city"] ? "form__input--error" : ""}`}
                type="text"
                value={formData.senderAddress.city}
                onChange={(e) => updateSenderAddress("city", e.target.value)}
                aria-invalid={Boolean(errors["senderAddress.city"])}
              />
              {errors["senderAddress.city"] && (
                <span className="form__error" role="alert">
                  {errors["senderAddress.city"]}
                </span>
              )}
            </div>

            <div className="form__group">
              <label className="form__label" htmlFor="senderPostCode">
                Post Code
              </label>
              <input
                id="senderPostCode"
                className={`form__input ${errors["senderAddress.postCode"] ? "form__input--error" : ""}`}
                type="text"
                value={formData.senderAddress.postCode}
                onChange={(e) =>
                  updateSenderAddress("postCode", e.target.value)
                }
                aria-invalid={Boolean(errors["senderAddress.postCode"])}
              />
              {errors["senderAddress.postCode"] && (
                <span className="form__error" role="alert">
                  {errors["senderAddress.postCode"]}
                </span>
              )}
            </div>

            <div className="form__group">
              <label className="form__label" htmlFor="senderCountry">
                Country
              </label>
              <input
                id="senderCountry"
                className={`form__input ${errors["senderAddress.country"] ? "form__input--error" : ""}`}
                type="text"
                value={formData.senderAddress.country}
                onChange={(e) => updateSenderAddress("country", e.target.value)}
                aria-invalid={Boolean(errors["senderAddress.country"])}
              />
              {errors["senderAddress.country"] && (
                <span className="form__error" role="alert">
                  {errors["senderAddress.country"]}
                </span>
              )}
            </div>
          </div>
        </fieldset>

        {/* ── BILL TO ── */}
        <fieldset className="form__fieldset">
          <legend className="form__legend">Bill To</legend>

          <div className="form__group form__group--full">
            <label className="form__label" htmlFor="clientName">
              Client's Name
            </label>
            <input
              id="clientName"
              className={`form__input ${errors.clientName ? "form__input--error" : ""}`}
              type="text"
              value={formData.clientName}
              onChange={(e) => updateField("clientName", e.target.value)}
              aria-describedby={
                errors.clientName ? "clientName-error" : undefined
              }
              aria-invalid={Boolean(errors.clientName)}
            />
            {errors.clientName && (
              <span className="form__error" id="clientName-error" role="alert">
                {errors.clientName}
              </span>
            )}
          </div>

          <div className="form__group form__group--full">
            <label className="form__label" htmlFor="clientEmail">
              Client's Email
            </label>
            <input
              id="clientEmail"
              className={`form__input ${errors.clientEmail ? "form__input--error" : ""}`}
              type="email"
              value={formData.clientEmail}
              onChange={(e) => updateField("clientEmail", e.target.value)}
              aria-describedby={
                errors.clientEmail ? "clientEmail-error" : undefined
              }
              aria-invalid={Boolean(errors.clientEmail)}
              placeholder="e.g. email@example.com"
            />
            {errors.clientEmail && (
              <span className="form__error" id="clientEmail-error" role="alert">
                {errors.clientEmail}
              </span>
            )}
          </div>

          <div className="form__group form__group--full">
            <label className="form__label" htmlFor="clientStreet">
              Street Address
            </label>
            <input
              id="clientStreet"
              className={`form__input ${errors["clientAddress.street"] ? "form__input--error" : ""}`}
              type="text"
              value={formData.clientAddress.street}
              onChange={(e) => updateClientAddress("street", e.target.value)}
              aria-invalid={Boolean(errors["clientAddress.street"])}
            />
            {errors["clientAddress.street"] && (
              <span className="form__error" role="alert">
                {errors["clientAddress.street"]}
              </span>
            )}
          </div>

          <div className="form__row form__row--3">
            <div className="form__group">
              <label className="form__label" htmlFor="clientCity">
                City
              </label>
              <input
                id="clientCity"
                className={`form__input ${errors["clientAddress.city"] ? "form__input--error" : ""}`}
                type="text"
                value={formData.clientAddress.city}
                onChange={(e) => updateClientAddress("city", e.target.value)}
                aria-invalid={Boolean(errors["clientAddress.city"])}
              />
              {errors["clientAddress.city"] && (
                <span className="form__error" role="alert">
                  {errors["clientAddress.city"]}
                </span>
              )}
            </div>

            <div className="form__group">
              <label className="form__label" htmlFor="clientPostCode">
                Post Code
              </label>
              <input
                id="clientPostCode"
                className={`form__input ${errors["clientAddress.postCode"] ? "form__input--error" : ""}`}
                type="text"
                value={formData.clientAddress.postCode}
                onChange={(e) =>
                  updateClientAddress("postCode", e.target.value)
                }
                aria-invalid={Boolean(errors["clientAddress.postCode"])}
              />
              {errors["clientAddress.postCode"] && (
                <span className="form__error" role="alert">
                  {errors["clientAddress.postCode"]}
                </span>
              )}
            </div>

            <div className="form__group">
              <label className="form__label" htmlFor="clientCountry">
                Country
              </label>
              <input
                id="clientCountry"
                className={`form__input ${errors["clientAddress.country"] ? "form__input--error" : ""}`}
                type="text"
                value={formData.clientAddress.country}
                onChange={(e) => updateClientAddress("country", e.target.value)}
                aria-invalid={Boolean(errors["clientAddress.country"])}
              />
              {errors["clientAddress.country"] && (
                <span className="form__error" role="alert">
                  {errors["clientAddress.country"]}
                </span>
              )}
            </div>
          </div>
        </fieldset>

        {/* ── INVOICE DETAILS ── */}
        <fieldset className="form__fieldset">
          <legend className="form__legend sr-only">Invoice Details</legend>

          <div className="form__row form__row--2">
            <div className="form__group">
              <label className="form__label" htmlFor="createdAt">
                Invoice Date
              </label>
              <input
                id="createdAt"
                className="form__input"
                type="date"
                value={formData.createdAt}
                onChange={(e) => updateField("createdAt", e.target.value)}
                disabled={isEditMode}
                aria-disabled={isEditMode}
              />
            </div>

            <div className="form__group">
              <label className="form__label" htmlFor="paymentTerms">
                Payment Terms
              </label>
              <select
                id="paymentTerms"
                className="form__input form__select"
                value={formData.paymentTerms}
                onChange={(e) =>
                  updateField("paymentTerms", Number(e.target.value))
                }
              >
                <option value={1}>Net 1 Day</option>
                <option value={7}>Net 7 Days</option>
                <option value={14}>Net 14 Days</option>
                <option value={30}>Net 30 Days</option>
              </select>
            </div>
          </div>

          <div className="form__group form__group--full">
            <label className="form__label" htmlFor="description">
              Project Description
            </label>
            <input
              id="description"
              className={`form__input ${errors.description ? "form__input--error" : ""}`}
              type="text"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="e.g. Graphic Design Service"
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description && (
              <span className="form__error" role="alert">
                {errors.description}
              </span>
            )}
          </div>
        </fieldset>

        {/* ── ITEM LIST ── */}
        <div className="form__items">
          <h2 className="form__items-title">Item List</h2>

          {/* Items error (no items added) */}
          {errors.items && (
            <p className="form__error form__error--items" role="alert">
              {errors.items}
            </p>
          )}

          {/* Item rows */}
          {formData.items.length > 0 && (
            <div className="form__items-list">
              {/* Column headers — desktop only */}
              <div className="form__items-header" aria-hidden="true">
                <span>Item Name</span>
                <span>Qty.</span>
                <span>Price</span>
                <span>Total</span>
                <span></span>
              </div>

              {formData.items.map((item, index) => (
                <div key={item.id} className="form__item-row">
                  {/* Item Name */}
                  <div className="form__group form__item-name">
                    <label
                      className="form__label form__label--mobile-only"
                      htmlFor={`item-name-${index}`}
                    >
                      Item Name
                    </label>
                    <input
                      id={`item-name-${index}`}
                      className={`form__input ${errors[`items[${index}].name`] ? "form__input--error" : ""}`}
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(index, "name", e.target.value)
                      }
                      aria-label={`Item ${index + 1} name`}
                      aria-invalid={Boolean(errors[`items[${index}].name`])}
                    />
                    {errors[`items[${index}].name`] && (
                      <span className="form__error" role="alert">
                        {errors[`items[${index}].name`]}
                      </span>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="form__group form__item-qty">
                    <label
                      className="form__label form__label--mobile-only"
                      htmlFor={`item-qty-${index}`}
                    >
                      Qty.
                    </label>
                    <input
                      id={`item-qty-${index}`}
                      className={`form__input ${errors[`items[${index}].quantity`] ? "form__input--error" : ""}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", Number(e.target.value))
                      }
                      aria-label={`Item ${index + 1} quantity`}
                      aria-invalid={Boolean(errors[`items[${index}].quantity`])}
                    />
                  </div>

                  {/* Price */}
                  <div className="form__group form__item-price">
                    <label
                      className="form__label form__label--mobile-only"
                      htmlFor={`item-price-${index}`}
                    >
                      Price
                    </label>
                    <input
                      id={`item-price-${index}`}
                      className={`form__input ${errors[`items[${index}].price`] ? "form__input--error" : ""}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(index, "price", Number(e.target.value))
                      }
                      aria-label={`Item ${index + 1} price`}
                      aria-invalid={Boolean(errors[`items[${index}].price`])}
                    />
                  </div>

                  {/* Auto-calculated total */}
                  <div className="form__item-total">
                    <span
                      className="form__label form__label--mobile-only"
                      aria-hidden="true"
                    >
                      Total
                    </span>
                    <span
                      className="form__item-total-value"
                      aria-label={`Item ${index + 1} total: ${formatCurrency(item.total)}`}
                    >
                      {formatCurrency(item.total)}
                    </span>
                  </div>

                  {/* Remove item button */}
                  <button
                    type="button"
                    className="form__item-remove"
                    onClick={() => removeItem(index)}
                    aria-label={`Remove item ${item.name || index + 1}`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new item button */}
          <button type="button" className="form__add-item" onClick={addItem}>
            + Add New Item
          </button>
        </div>
        {/* Error summary — shown after failed submit attempt */}
        {submitAttempted && hasErrors(errors) && (
          <div
            className="form__error-summary"
            role="alert"
            aria-live="assertive"
          >
            <p>— All fields must be added</p>
            {errors.items && <p>— An item must be added</p>}
          </div>
        )}

        {/* ── FORM ACTIONS ── */}
        <div className="form__actions">
          {!isEditMode && (
            <button
              type="button"
              className="form__btn form__btn--discard"
              onClick={handleDiscard}
            >
              Discard
            </button>
          )}

          <div className="form__actions-right">
            {!isEditMode && (
              <button
                type="button"
                className="form__btn form__btn--draft"
                onClick={handleSaveAsDraft}
              >
                Save as Draft
              </button>
            )}

            <button type="submit" className="form__btn form__btn--submit">
              {isEditMode ? "Save Changes" : "Save & Send"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// Icons
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
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="16"
      viewBox="0 0 13 16"
      aria-hidden="true"
    >
      <path
        d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.778-1.778V3.556h10.667zM8.473 0l.888.889H13v1.778H0V.889h3.64L4.527 0z"
        fill="#888EB0"
        fillRule="nonzero"
      />
    </svg>
  );
}
