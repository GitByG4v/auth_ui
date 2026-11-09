import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { authService } from '../services/authService'
import type { User, AuthContextType } from '../types/auth'

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

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

  const login = useCallback(async ({ email, password, rememberMe }: { email: string; password: string; rememberMe?: boolean }) => {
    setError(null)
    try {
      const authenticatedUser = await authService.login({ email, password, rememberMe })
      setUser(authenticatedUser)
      return authenticatedUser
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in.'
      setError(message)
      throw err
    }
  }, [])

  const register = useCallback(async ({ name, email, password }: { name: string; email: string; password: string }) => {
    setError(null)
    try {
      const newUser = await authService.register({ name, email, password })
      return newUser
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed.'
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

  const requestPasswordReset = useCallback(async (email: string) => {
    setError(null)
    return await authService.requestPasswordReset({ email })
  }, [])

  const value: AuthContextType = {
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

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>')
  }
  return context
}

