import { useTheme } from "../context/ThemeContext"
import Logo from "./Logo"
import "./Sidebar.css"

// Moon icon for dark mode toggle
function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M19.502 11.342a.703.703 0 00-.588.128 7.499 7.499 0 01-2.275 1.33 7.123 7.123 0 01-2.581.46A7.516 7.516 0 018.74 8.924a7.516 7.516 0 01.174-5.309.703.703 0 00-.718-.985A10.167 10.167 0 002.5 5.43 10.177 10.177 0 00.003 10.116 10.08 10.08 0 003.008 17.5a10.078 10.078 0 007.015 2.997 10.16 10.16 0 006.784-2.607 10.16 10.16 0 003.128-6.457.703.703 0 00-.433-.091z"
        fill="#858BB2"
        fillRule="nonzero"
      />
    </svg>
  )
}

// Sun icon for light mode toggle
function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M10 13.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM10 2a1 1 0 001-1V1a1 1 0 00-2 0v.5a1 1 0 001 1zM10 18a1 1 0 00-1 1v.5a1 1 0 002 0V19a1 1 0 00-1-1zM3.05 4.464a1 1 0 001.414 0l.354-.353a1 1 0 00-1.414-1.414l-.354.353a1 1 0 000 1.414zM16.596 16.95a1 1 0 00-1.414 1.414l.353.353a1 1 0 001.414-1.414l-.353-.353zM2 10a1 1 0 00-1-1H.5a1 1 0 000 2H1a1 1 0 001-1zM19.5 9H19a1 1 0 000 2h.5a1 1 0 000-2zM4.464 16.95l-.353.353a1 1 0 001.414 1.414l.353-.354a1 1 0 00-1.414-1.414zM15.182 4.818a1 1 0 001.414 0l.353-.354a1 1 0 00-1.414-1.414l-.353.354a1 1 0 000 1.414z"
        fill="#858BB2"
        fillRule="nonzero"
      />
    </svg>
  )
}

// Avatar icon
function AvatarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#7C5DFA" />
      <path
        d="M16 17a4 4 0 100-8 4 4 0 000 8zm0 2c-4.418 0-8 2.015-8 4.5V25h16v-1.5c0-2.485-3.582-4.5-8-4.5z"
        fill="#fff"
      />
    </svg>
  )
}

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <aside className="sidebar" aria-label="Main navigation">

      {/* Logo */}
      <div className="sidebar__logo" aria-label="Invoice app logo">
        <Logo />
      </div>

      {/* Bottom section: theme toggle + avatar */}
      <div className="sidebar__bottom">

        {/* Theme toggle button */}
        <button
          className="sidebar__theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>

        {/* Divider */}
        <div className="sidebar__divider" aria-hidden="true" />

        {/* Avatar */}
        <div className="sidebar__avatar">
          <AvatarIcon />
        </div>

      </div>
    </aside>
  )
}