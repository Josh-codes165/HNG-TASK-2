import { useState, useRef, useEffect } from "react"
import "./FilterDropdown.css"

const STATUSES = ["draft", "pending", "paid"]

export default function FilterDropdown({ activeFilters, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close on ESC key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  function toggleFilter(status) {
    if (activeFilters.includes(status)) {
      onChange(activeFilters.filter(f => f !== status))
    } else {
      onChange([...activeFilters, status])
    }
  }

  return (
    <div className="filter" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        className="filter__trigger"
        onClick={() => setIsOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="filter__label">
          Filter <span className="filter__label--desktop">by status</span>
        </span>
        <svg
          className={`filter__chevron ${isOpen ? "filter__chevron--open" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="7"
          viewBox="0 0 11 7"
          aria-hidden="true"
        >
          <path
            d="M1 1l4.228 4.228L9.456 1"
            stroke="#7C5DFA"
            strokeWidth="2"
            fill="none"
            fillRule="evenodd"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="filter__dropdown" role="listbox" aria-label="Filter by status">
          {STATUSES.map(status => (
            <label key={status} className="filter__option">
              <input
                type="checkbox"
                className="filter__checkbox"
                checked={activeFilters.includes(status)}
                onChange={() => toggleFilter(status)}
                aria-label={`Filter by ${status}`}
              />
              <span className="filter__checkbox-custom" aria-hidden="true">
                {activeFilters.includes(status) && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8">
                    <path
                      d="M1.5 4L3.833 6.5 8.5 1.5"
                      stroke="#fff"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="filter__status-label">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}