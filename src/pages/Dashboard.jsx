import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/Button'
import { ShieldCheck, LogOut, User, CheckCircle2, Mail, Hash } from 'lucide-react'

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
              You are signed in to your secure account dashboard.
            </p>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success)',
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem',
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={16} />
            <span>Active Session</span>
          </div>
        </section>

        {/* Profile Information Card */}
        <section className="dashboard-card">
          <div className="dashboard-card-header">
            <User size={18} color="var(--accent)" />
            <span>Account Details</span>
          </div>
          <ul className="profile-list">
            <li className="profile-item">
              <span className="profile-item-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={14} color="var(--text-subtle)" />
                <span>Full Name</span>
              </span>
              <span className="profile-item-value">{user?.name}</span>
            </li>
            <li className="profile-item">
              <span className="profile-item-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={14} color="var(--text-subtle)" />
                <span>Email Address</span>
              </span>
              <span className="profile-item-value">{user?.email}</span>
            </li>
            <li className="profile-item">
              <span className="profile-item-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Hash size={14} color="var(--text-subtle)" />
                <span>Account ID</span>
              </span>
              <span className="profile-item-value">{user?.id}</span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}
