import { Loader2 } from 'lucide-react'

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
}) {
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
