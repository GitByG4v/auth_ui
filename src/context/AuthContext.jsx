import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Restore session on initial application load (survives page refresh)
  useEffect(() => {
    let isMounted = true

    async function restoreSession() {
      try {
        const existingUser = await authService.getSession()
        if (isMounted && existingUser) {
          setUser(existingUser)
        }
      } catch (err) {
        console.error('Failed to restore authentication session:', err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      isMounted = false
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const login = useCallback(async ({ email, password, rememberMe }) => {
    setError(null)
    try {
      const authenticatedUser = await authService.login({ email, password, rememberMe })
      setUser(authenticatedUser)
      return authenticatedUser
    } catch (err) {
      const message = err.message || 'Failed to sign in.'
      setError(message)
      throw err
    }
  }, [])

  const register = useCallback(async ({ name, email, password }) => {
    setError(null)
    try {
      const newUser = await authService.register({ name, email, password })
      return newUser
    } catch (err) {
      const message = err.message || 'Registration failed.'
      setError(message)
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
      setError(null)
    }
  }, [])

  const requestPasswordReset = useCallback(async (email) => {
    setError(null)
    return await authService.requestPasswordReset({ email })
  }, [])

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
    clearError,
    login,
    register,
    logout,
    requestPasswordReset,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Custom hook to consume authentication context safely.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>')
  }
  return context
}
