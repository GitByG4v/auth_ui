import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

const THEME_STORAGE_KEY = 'auth_app_theme_mode'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // 1. Check saved user preference in localStorage
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') {
      return saved
    }
    // 2. Fall back to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })

  useEffect(() => {
    // Apply theme attribute to <html> tag for CSS custom properties
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const value = {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a <ThemeProvider>')
  }
  return context
}

