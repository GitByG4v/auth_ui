import { useState } from 'react'
import { generatePassword, generatePassphrase } from '../utils/passwordGenerator'
import { RefreshCw, Copy, Check, KeyRound, Sparkles } from 'lucide-react'
import { Button } from './Button'

export function PasswordGenerator({ onSelectPassword, onClose }) {
  const [mode, setMode] = useState('chars') // 'chars' | 'passphrase'
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  })
  const [generatedPassword, setGeneratedPassword] = useState(() =>
    generatePassword({ length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true })
  )
  const [copied, setCopied] = useState(false)

  const regenerate = (customMode = mode, customLength = length, customOptions = options) => {
    if (customMode === 'passphrase') {
      setGeneratedPassword(generatePassphrase(4, '-'))
    } else {
      setGeneratedPassword(generatePassword({ length: customLength, ...customOptions }))
    }
    setCopied(false)
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    regenerate(newMode, length, options)
  }

  const handleLengthChange = (newLength) => {
    setLength(newLength)
    regenerate(mode, newLength, options)
  }

  const handleCheckboxChange = (key) => {
    const activeCount = Object.values(options).filter(Boolean).length
    if (options[key] && activeCount === 1) return

    const newOptions = {
      ...options,
      [key]: !options[key],
    }
    setOptions(newOptions)
    regenerate(mode, length, newOptions)
  }

  const handleCopy = async () => {
    if (!generatedPassword) return
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(generatedPassword)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = generatedPassword
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert('Unable to access clipboard. Please copy manually.')
    }
  }

  return (
    <div className="generator-card" aria-label="Secure Password Generator">
      <div className="generator-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
          <Sparkles size={16} color="var(--accent)" />
          <span>Secure Password Generator</span>
        </div>
        {onClose && (
          <button
            type="button"
            className="generator-close-btn"
            onClick={onClose}
            aria-label="Close generator"
          >
            ×
          </button>
        )}
      </div>

      {/* Generated Output Display */}
      <div className="generator-display-row">
        <div className="generator-output" title={generatedPassword}>
          {generatedPassword}
        </div>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            type="button"
            className="btn-icon"
            onClick={() => regenerate()}
            title="Generate new password"
            aria-label="Generate new password"
          >
            <RefreshCw size={16} />
          </button>
          <button
            type="button"
            className="btn-icon"
            onClick={handleCopy}
            title="Copy password to clipboard"
            aria-label="Copy password to clipboard"
          >
            {copied ? <Check size={16} color="var(--accent)" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {copied && (
        <p className="generator-copied-notice" role="status">
          ✓ Copied to clipboard!
        </p>
      )}

      {/* Mode Selector */}
      <div className="generator-mode-row">
        <label className="generator-radio-label">
          <input
            type="radio"
            name="generatorMode"
            checked={mode === 'chars'}
            onChange={() => handleModeChange('chars')}
          />
          <span>Random Characters</span>
        </label>
        <label className="generator-radio-label">
          <input
            type="radio"
            name="generatorMode"
            checked={mode === 'passphrase'}
            onChange={() => handleModeChange('passphrase')}
          />
          <span>Passphrase (4 Words)</span>
        </label>
      </div>

      {/* Character Mode Controls */}
      {mode === 'chars' && (
        <div className="generator-controls">
          <div className="generator-slider-row">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
              <span>Length</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>{length}</strong>
            </div>
            <input
              type="range"
              min="8"
              max="32"
              value={length}
              onChange={(e) => handleLengthChange(Number(e.target.value))}
              className="generator-slider"
            />
          </div>

          <div className="generator-checkbox-grid">
            <label className="form-checkbox-label" style={{ fontSize: '0.8125rem' }}>
              <input
                type="checkbox"
                className="form-checkbox"
                checked={options.uppercase}
                onChange={() => handleCheckboxChange('uppercase')}
              />
              <span>Uppercase (A-Z)</span>
            </label>
            <label className="form-checkbox-label" style={{ fontSize: '0.8125rem' }}>
              <input
                type="checkbox"
                className="form-checkbox"
                checked={options.lowercase}
                onChange={() => handleCheckboxChange('lowercase')}
              />
              <span>Lowercase (a-z)</span>
            </label>
            <label className="form-checkbox-label" style={{ fontSize: '0.8125rem' }}>
              <input
                type="checkbox"
                className="form-checkbox"
                checked={options.numbers}
                onChange={() => handleCheckboxChange('numbers')}
              />
              <span>Numbers (0-9)</span>
            </label>
            <label className="form-checkbox-label" style={{ fontSize: '0.8125rem' }}>
              <input
                type="checkbox"
                className="form-checkbox"
                checked={options.symbols}
                onChange={() => handleCheckboxChange('symbols')}
              />
              <span>Symbols (!@#$)</span>
            </label>
          </div>
        </div>
      )}

      {/* Action: Fill into Form */}
      <div style={{ marginTop: '0.85rem' }}>
        <Button
          type="button"
          variant="primary"
          isFullWidth
          onClick={() => onSelectPassword && onSelectPassword(generatedPassword)}
        >
          <KeyRound size={16} />
          <span>Use This Password</span>
        </Button>
      </div>
    </div>
  )
}
