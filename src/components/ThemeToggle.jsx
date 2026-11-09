import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export function ThemeToggle({ className = '', floating = false }) {
  const { isDark, toggleTheme } = useTheme()

  const classes = [
    'theme-toggle-btn',
    floating ? 'theme-toggle-floating' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={classes}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun size={18} className="theme-toggle-icon" />
      ) : (
        <Moon size={18} className="theme-toggle-icon" />
      )}
    </button>
  )
}

