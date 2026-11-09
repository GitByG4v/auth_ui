import { ReactNode, ComponentType } from 'react'
import { Lock } from 'lucide-react'
import { MatrixBackground } from './MatrixBackground'
import { ThemeToggle } from './ThemeToggle'

export interface AuthLayoutProps {
  icon?: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  title?: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({
  icon: Icon = Lock,
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <>
      <MatrixBackground />
      <ThemeToggle floating />

      <main className="auth-wrapper">
        <div className="auth-card">
          <header className="auth-header">
            <div className="auth-icon-badge" aria-hidden="true">
              <Icon size={28} strokeWidth={2.2} />
            </div>
            {title && <h1 className="auth-title">{title}</h1>}
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
            <div className="auth-header-divider" aria-hidden="true" />
          </header>

          <div className="auth-body">{children}</div>

          {footer && <footer className="auth-footer">{footer}</footer>}
        </div>
      </main>
    </>
  )
}

