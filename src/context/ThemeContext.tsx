import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { ThemeContextType } from '../types/auth'
import { useAuth } from './AuthContext'

const ThemeContext = createContext<ThemeContextType | null>(null)

const GLOBAL_THEME_KEY = 'auth_app_theme_mode'
const getUserThemeKey = (userId: string) => `auth_user_theme_${userId}`

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(GLOBAL_THEME_KEY)
    if (saved === 'dark' || saved === 'light') {
      return saved
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })

  useEffect(() => {
    if (user?.id) {
      const userTheme = localStorage.getItem(getUserThemeKey(user.id))
      if (userTheme === 'dark' || userTheme === 'light') {
        setTheme(userTheme)
      }
    }
  }, [user?.id])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(GLOBAL_THEME_KEY, theme)
    if (user?.id) {
      localStorage.setItem(getUserThemeKey(user.id), theme)
    }
  }, [theme, user?.id])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const value: ThemeContextType = {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a <ThemeProvider>')
  }
  return context
}

