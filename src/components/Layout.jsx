import Sidebar from "./Sidebar"
import "./Layout.css"

export default function Layout({ children }) {
  return (
    <div className="layout">
      {/* Skip link — first focusable element on the page */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Sidebar />
      <main className="layout__content" id="main-content">
        {children}
      </main>
    </div>
  )
}