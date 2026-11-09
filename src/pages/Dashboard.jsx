import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/Button'
import {
  ShieldCheck,
  LogOut,
  User,
  Database,
  ShieldAlert,
  CheckCircle2,
  Lock,
} from 'lucide-react'

export function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      navigate('/login', { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
      {/* Top Navigation Bar */}
      <header className="navbar">
        <div className="navbar-brand">
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--accent-subtle)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <span>Auth System</span>
        </div>

        <div className="navbar-user">
          <div className="navbar-user-info">
            <div className="navbar-user-name">{user?.name}</div>
            <div className="navbar-user-email">{user?.email}</div>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleLogout}
            isLoading={isLoggingOut}
            loadingText="Logging out..."
            aria-label="Log out of account"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="dashboard-container">
        {/* Hero Welcome Card */}
        <section className="dashboard-hero">
          <div>
            <h1 className="dashboard-hero-title">Welcome back, {user?.name}! 👋</h1>
            <p className="dashboard-hero-subtitle">
              You have successfully authenticated into the protected dashboard area.
            </p>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem',
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={16} />
            <span>Session Verified</span>
          </div>
        </section>

        {/* 2-Column Info Grid */}
        <div className="dashboard-grid">
          {/* Profile Card */}
          <section className="dashboard-card">
            <div className="dashboard-card-header">
              <User size={18} color="var(--accent)" />
              <span>User Profile</span>
            </div>
            <ul className="profile-list">
              <li className="profile-item">
                <span className="profile-item-label">Full Name</span>
                <span className="profile-item-value">{user?.name}</span>
              </li>
              <li className="profile-item">
                <span className="profile-item-label">Email Address</span>
                <span className="profile-item-value">{user?.email}</span>
              </li>
              <li className="profile-item">
                <span className="profile-item-label">Account ID</span>
                <span className="profile-item-value">{user?.id}</span>
              </li>
            </ul>
          </section>

          {/* Session Architecture Card */}
          <section className="dashboard-card">
            <div className="dashboard-card-header">
              <Database size={18} color="var(--accent)" />
              <span>Session Architecture</span>
            </div>
            <ul className="profile-list">
              <li className="profile-item">
                <span className="profile-item-label">State Management</span>
                <span className="profile-item-value">React Context API</span>
              </li>
              <li className="profile-item">
                <span className="profile-item-label">Route Guard</span>
                <span className="profile-item-value">&lt;ProtectedRoute /&gt;</span>
              </li>
              <li className="profile-item">
                <span className="profile-item-label">Password Hashing</span>
                <span className="profile-item-value">Web Crypto SHA-256</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Security Architecture Notes Panel (Interview Talking Points) */}
        <section className="security-panel" aria-labelledby="security-notes-heading">
          <div className="security-panel-header" id="security-notes-heading">
            <ShieldAlert size={20} />
            <span>Security Architecture & Production Limitations (Interview Reference)</span>
          </div>
          <ul className="security-panel-list">
            <li>
              <strong>Frontend Route Protection is NOT Real Authorization:</strong> Client-side
              route guards like <code>&lt;ProtectedRoute /&gt;</code> only improve user experience by
              preventing unauthorized UI access. True security requires the backend to validate
              session tokens or cookies on every incoming API request.
            </li>
            <li>
              <strong>LocalStorage vs. HttpOnly Cookies:</strong> This client-only demo uses browser
              storage behind an <code>authService</code> abstraction. In production, sensitive session
              tokens must be stored in <code>HttpOnly</code>, <code>Secure</code>,{' '}
              <code>SameSite=Strict</code> cookies to eliminate XSS token theft.
            </li>
            <li>
              <strong>Backend Password Hashing:</strong> Passwords in this demo are salted and hashed
              via Web Crypto SHA-256 to avoid plaintext in memory/storage. Real backends must use
              computationally intensive, memory-hard algorithms such as <strong>Argon2id</strong> or{' '}
              <strong>bcrypt</strong>.
            </li>
            <li>
              <strong>Password Reset Flow:</strong> A true reset flow requires backend generation of
              a cryptographically random, single-use, time-limited token delivered through verified
              email (e.g., SMTP/SES) with strict rate limiting.
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}

