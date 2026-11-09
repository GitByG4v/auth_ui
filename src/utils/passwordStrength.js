/**
 * passwordStrength.js
 *
 * Standalone password strength analyzer logic.
 * Decoupled from React UI for 100% testability.
 */

// Common weak passwords and predictable keyboard sequences
const COMMON_PATTERNS = [
  'password',
  '123456',
  '12345678',
  'qwerty',
  'admin',
  'welcome',
  'abc123',
  'letmein',
  'monkey',
  'football',
  'login',
]

/**
 * Checks individual security requirements.
 */
export function checkRequirements(password = '') {
  return [
    {
      id: 'length',
      label: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      id: 'lowercase',
      label: 'At least one lowercase letter (a-z)',
      met: /[a-z]/.test(password),
    },
    {
      id: 'uppercase',
      label: 'At least one uppercase letter (A-Z)',
      met: /[A-Z]/.test(password),
    },
    {
      id: 'number',
      label: 'At least one number (0-9)',
      met: /[0-9]/.test(password),
    },
    {
      id: 'symbol',
      label: 'At least one special symbol (!@#$%^&*)',
      met: /[^A-Za-z0-9]/.test(password),
    },
  ]
}

/**
 * Detects common patterns, sequential characters, and excessive repeats.
 */
export function detectPatterns(password = '') {
  const lower = password.toLowerCase()
  const issues = []

  // Check known blacklist substrings
  for (const pattern of COMMON_PATTERNS) {
    if (lower.includes(pattern)) {
      issues.push(`Contains predictable word or pattern ("${pattern}")`)
      break
    }
  }

  // Check repeated characters (e.g., "aaaa" or "1111")
  if (/(.)\1{3,}/.test(password)) {
    issues.push('Contains 4 or more repeated consecutive characters')
  }

  // Check sequential sequences (e.g. 1234, abcd)
  const sequences = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'qwertyuiop']
  for (const seq of sequences) {
    for (let i = 0; i <= seq.length - 4; i++) {
      const slice = seq.substring(i, i + 4)
      if (lower.includes(slice)) {
        issues.push(`Contains sequential characters ("${slice}")`)
        break
      }
    }
  }

  return issues
}

/**
 * Estimates brute-force crack effort in plain human terms.
 * Rough estimate based on a high-end offline GPU cracking cluster (~10^10 guesses/sec).
 * Explicitly presented as an estimate, NOT a guarantee.
 */
export function estimateCrackEffort(password = '') {
  if (!password || password.length === 0) return 'None'

  let poolSize = 0
  if (/[a-z]/.test(password)) poolSize += 26
  if (/[A-Z]/.test(password)) poolSize += 26
  if (/[0-9]/.test(password)) poolSize += 10
  if (/[^A-Za-z0-9]/.test(password)) poolSize += 33

  if (poolSize === 0) return 'Instantly'

  // Total combinations = poolSize ^ length
  // In logarithmic entropy bits:
  const entropyBits = password.length * Math.log2(poolSize)

  if (entropyBits < 28) return 'Instantly'
  if (entropyBits < 36) return 'Few seconds'
  if (entropyBits < 45) return 'Few minutes'
  if (entropyBits < 55) return 'Several hours'
  if (entropyBits < 65) return 'A few days'
  if (entropyBits < 75) return 'Several months'
  if (entropyBits < 85) return 'Several years'
  return 'Centuries'
}

/**
 * Evaluates password strength score (0 to 4), label, color token, and suggestions.
 */
export function evaluatePasswordStrength(password = '') {
  if (!password) {
    return {
      score: 0,
      label: 'Empty',
      color: 'var(--text-subtle)',
      requirements: checkRequirements(''),
      issues: [],
      crackEffort: 'None',
      suggestion: 'Enter a password to evaluate its strength.',
    }
  }

  const requirements = checkRequirements(password)
  const metCount = requirements.filter((r) => r.met).length
  const issues = detectPatterns(password)

  let baseScore = 0

  if (password.length >= 8) baseScore += 1
  if (password.length >= 12) baseScore += 1
  if (metCount >= 4) baseScore += 1
  if (metCount === 5 && password.length >= 10) baseScore += 1

  // Penalty for predictable patterns
  if (issues.length > 0) {
    baseScore = Math.max(0, baseScore - 1)
  }

  // Constrain between 0 and 4
  const finalScore = Math.min(4, Math.max(0, baseScore))

  const tierMap = [
    { label: 'Very Weak', color: 'var(--danger)' },
    { label: 'Weak', color: '#EA580C' },
    { label: 'Fair', color: '#D97706' },
    { label: 'Strong', color: '#D97757' },
    { label: 'Very Strong', color: 'var(--success)' },
  ]

  const tier = tierMap[finalScore]

  // Actionable suggestion
  let suggestion = 'Password looks great!'
  if (!requirements.find((r) => r.id === 'length')?.met) {
    suggestion = 'Make your password at least 8 characters long.'
  } else if (metCount < 4) {
    suggestion = 'Add a combination of numbers and special symbols.'
  } else if (issues.length > 0) {
    suggestion = 'Avoid predictable patterns, words, or repeat sequences.'
  } else if (password.length < 12) {
    suggestion = 'Consider making it 12+ characters for maximum brute-force resistance.'
  }

  return {
    score: finalScore,
    label: tier.label,
    color: tier.color,
    requirements,
    issues,
    crackEffort: estimateCrackEffort(password),
    suggestion,
  }
}

