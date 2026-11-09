import { useMemo } from 'react'
import { evaluatePasswordStrength } from '../utils/passwordStrength'
import { Check, X, ShieldAlert, Zap } from 'lucide-react'

export interface PasswordStrengthMeterProps {
  password?: string
}

export function PasswordStrengthMeter({ password = '' }: PasswordStrengthMeterProps) {
  const analysis = useMemo(() => evaluatePasswordStrength(password), [password])

  if (!password) {
    return null
  }

  const { score, label, color, requirements, issues, crackEffort, suggestion } = analysis

  return (
    <div className="strength-meter-container" aria-live="polite">
      <div className="strength-meter-header">
        <span className="strength-label">
          Strength:{' '}
          <strong style={{ color }}>{label}</strong>
        </span>
        <span className="crack-effort-badge" title="Estimated offline cracking resistance">
          Crack effort: <strong>~{crackEffort}</strong>
        </span>
      </div>

      <div className="strength-bars" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={4}>
        {[1, 2, 3, 4].map((step) => {
          const isActive = score >= step
          return (
            <div
              key={step}
              className="strength-bar-segment"
              style={{
                backgroundColor: isActive ? color : 'var(--border-color)',
              }}
            />
          )
        })}
      </div>

      <div className="strength-requirements-grid">
        {requirements.map((req) => (
          <div
            key={req.id}
            className={`strength-req-item ${req.met ? 'is-met' : ''}`}
          >
            {req.met ? (
              <Check size={14} className="req-icon req-check" aria-hidden="true" />
            ) : (
              <X size={14} className="req-icon req-cross" aria-hidden="true" />
            )}
            <span>{req.label}</span>
          </div>
        ))}
      </div>

      {issues.length > 0 && (
        <div className="strength-warning-box">
          <ShieldAlert size={15} style={{ flexShrink: 0 }} />
          <span>{issues[0]}</span>
        </div>
      )}

      {suggestion && score < 4 && (
        <div className="strength-hint">
          <Zap size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <span>{suggestion}</span>
        </div>
      )}
    </div>
  )
}

