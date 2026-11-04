import { ShieldCheck } from 'lucide-react'

export function AuthLayout({
  icon: Icon = ShieldCheck,
  title,
  subtitle,
  children,
  footer,
}) {
  return (
    <main className="auth-wrapper">
      <div className="auth-card">
        <header className="auth-header">
          <div className="auth-icon-badge" aria-hidden="true">
            <Icon size={26} />
          </div>
          {title && <h1 className="auth-title">{title}</h1>}
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        </header>

        <div className="auth-body">
          {children}
        </div>

        {footer && (
          <footer className="auth-footer">
            {footer}
          </footer>
        )}
      </div>
    </main>
  )
}
