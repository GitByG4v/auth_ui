import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  isFullWidth?: boolean
  isLoading?: boolean
  loadingText?: string
}

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  isFullWidth = false,
  isLoading = false,
  loadingText,
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {
  const variantClass = `btn-${variant}`
  const fullWidthClass = isFullWidth ? 'btn-full' : ''
  const classes = ['btn', variantClass, fullWidthClass, className].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 size={18} className="spinner" aria-hidden="true" />
          <span>{loadingText || children}</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}

