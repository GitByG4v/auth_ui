import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ForgotPassword } from './pages/ForgotPassword'
import { Button } from './components/Button'
import { Loader2, ShieldCheck, LogOut, User } from 'lucide-react'

function AppContent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [currentView, setCurrentView] = useState('login')

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          color: 'var(--text-muted)',
        }}
      >
        <Loader2 size={36} className="spinner" style={{ color: 'var(--accent)' }} />
        <p style={{ fontSize: '0.9375rem' }}>Restoring session...</p>
      </div>
    )
  }

  if (isAuthenticated && user) {
    return (
      <main className="auth-wrapper">
        <div className="auth-card" style={{ maxWidth: '520px', textAlign: 'left' }}>
          <header className="auth-header">
            <div className="auth-icon-badge" aria-hidden="true" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
              <ShieldCheck size={28} />
            </div>
            <h1 className="auth-title">Session Active</h1>
            <p className="auth-subtitle">Authenticated state managed via AuthContext</p>
          </header>

          <div
            style={{
              backgroundColor: 'var(--bg-page)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{user.name}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{user.email}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
              User ID: <code style={{ fontFamily: 'var(--font-mono)' }}>{user.id}</code>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            isFullWidth
            onClick={logout}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <div>
      {currentView === 'login' && (
        <Login
          onNavigate={(view) => setCurrentView(view)}
        />
      )}
      {currentView === 'register' && (
        <Register
          onNavigate={(view) => setCurrentView(view)}
          onSuccess={() => setCurrentView('login')}
        />
      )}
      {currentView === 'forgot' && (
        <ForgotPassword
          onNavigate={(view) => setCurrentView(view)}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
