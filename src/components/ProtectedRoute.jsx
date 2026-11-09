import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader2 } from 'lucide-react'

/**
 * ProtectedRoute Wrapper
 *
 * Ensures that only authenticated users can access child routes.
 * CRITICAL LOGIC:
 * 1. Checks `isLoading` first: If the app is currently restoring a stored session
 *    (e.g., user reloaded /dashboard), we must NOT prematurely redirect to /login.
 * 2. If unauthenticated after loading: Redirects to /login, passing the current
 *    location in state (`from`) so the login page can seamlessly return the user back.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="loading-screen" role="status" aria-live="polite">
        <Loader2 size={36} className="spinner" style={{ color: 'var(--accent)' }} />
        <p>Restoring session...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

