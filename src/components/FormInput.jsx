import { forwardRef, useId } from 'react'

export const FormInput = forwardRef(function FormInput(
  {
    label,
    error,
    hint,
    id,
    type = 'text',
    rightElement,
    className = '',
    required = false,
    ...props
  },
  ref
) {
  const generatedId = useId()
  const inputId = id || generatedId
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          <span>
            {label} {required && <span aria-hidden="true" style={{ color: 'var(--danger)' }}>*</span>}
          </span>
        </label>
      )}

      <div className="form-input-container">
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          required={required}
          className={[
            'form-input',
            error ? 'is-error' : '',
            rightElement ? 'has-right-element' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />

        {rightElement && (
          <div className="form-input-right">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      )}

      {!error && hint && (
        <p id={hintId} className="form-hint">
          {hint}
        </p>
      )}
    </div>
  )
})
