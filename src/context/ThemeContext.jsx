import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext()

export function ThemeProvider({children}) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("invoice-theme") || "light"
    })

    useEffect(() => {
        localStorage.setItem("invoice-theme", theme)
        document.documentElement.setAttribute("data-theme", theme)
    }, [theme])

    function toggleTheme() {
        setTheme(prev => prev === "light" ? "dark" : "light")
    }

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}