import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/Button'
import { ThemeToggle } from '../components/ThemeToggle'
import { MatrixBackground } from '../components/MatrixBackground'
import { ShieldCheck, LogOut, User, CheckCircle2, Mail, Hash, KeyRound } from 'lucide-react'

export function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false)

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
    <div className="dashboard-page">
      <MatrixBackground />
      <div className="matrix-glow-overlay" />

      <header className="navbar">
        <div className="navbar-brand">
          <div className="navbar-logo-badge">
            <ShieldCheck size={20} />
          </div>
          <span>Auth System</span>
        </div>

        <div className="navbar-user">
          <ThemeToggle />
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

      <main className="dashboard-container">
        <section className="dashboard-hero">
          <div>
            <h1 className="dashboard-hero-title">Welcome back, {user?.name}! 👋</h1>
            <p className="dashboard-hero-subtitle">
              You are signed in to your secure account dashboard.
            </p>
          </div>
          <div className="dashboard-status-badge">
            <span className="pulse-dot" aria-hidden="true" />
            <CheckCircle2 size={16} />
            <span>Active Session</span>
          </div>
        </section>

        <section className="dashboard-card">
          <div className="dashboard-card-header">
            <div className="dashboard-card-icon-wrap">
              <User size={18} />
            </div>
            <span>Account Details</span>
          </div>
          <ul className="profile-list">
            <li className="profile-item">
              <span className="profile-item-label">
                <User size={15} color="var(--accent)" />
                <span>Full Name</span>
              </span>
              <span className="profile-item-value">{user?.name}</span>
            </li>
            <li className="profile-item">
              <span className="profile-item-label">
                <Mail size={15} color="var(--accent)" />
                <span>Email Address</span>
              </span>
              <span className="profile-item-value">{user?.email}</span>
            </li>
            <li className="profile-item">
              <span className="profile-item-label">
                <Hash size={15} color="var(--accent)" />
                <span>Account ID</span>
              </span>
              <span className="profile-item-value">{user?.id}</span>
            </li>
            <li className="profile-item">
              <span className="profile-item-label">
                <KeyRound size={15} color="var(--accent)" />
                <span>Security Protocol</span>
              </span>
              <span className="profile-item-value">Web Crypto SHA-256</span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}

