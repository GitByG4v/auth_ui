/**
 * passwordGenerator.js
 *
 * Cryptographically Secure Password Generator using native Web Crypto API.
 * NEVER uses Math.random().
 */

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

// Curated list of friendly, easy-to-type English words for passphrase generation
const PASSPHRASE_WORDS = [
  'amber', 'beacon', 'breeze', 'bridge', 'cactus', 'canvas', 'canyon', 'cedar',
  'cliff', 'clover', 'comet', 'coral', 'crater', 'crystal', 'delta', 'drift',
  'eagle', 'ember', 'falcon', 'feather', 'forest', 'frost', 'galaxy', 'glacier',
  'harbor', 'haven', 'horizon', 'island', 'jasper', 'lagoon', 'meadow', 'meteor',
  'mirage', 'monarch', 'nebula', 'oasis', 'ocean', 'orbit', 'pebble', 'phoenix',
  'pinnacle', 'planet', 'prairie', 'quartz', 'radar', 'rainbow', 'ranger', 'ravine',
  'ripple', 'river', 'rocket', 'safari', 'shadow', 'shield', 'sierra', 'silver',
  'solace', 'spark', 'summit', 'temple', 'thunder', 'timber', 'topaz', 'trail',
  'tundra', 'valley', 'vector', 'vortex', 'voyage', 'whisper', 'zenith', 'zephyr',
]

/**
 * Returns a cryptographically secure random integer in the range [0, max - 1].
 * Uses rejection sampling to eliminate modulo bias.
 */
export function getSecureRandomInt(max) {
  if (max <= 0) return 0
  const randomBuffer = new Uint32Array(1)
  const maxUint = 0xffffffff
  const limit = maxUint - (maxUint % max)

  let randomVal
  do {
    crypto.getRandomValues(randomBuffer)
    randomVal = randomBuffer[0]
  } while (randomVal >= limit)

  return randomVal % max
}

/**
 * Shuffles an array in-place using Fisher-Yates algorithm with CSPRNG.
 */
export function secureShuffle(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1)
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

/**
 * Generates a random character-based password.
 * Guarantees at least 1 character per selected category, then securely shuffles.
 */
export function generatePassword({
  length = 16,
  uppercase = true,
  lowercase = true,
  numbers = true,
  symbols = true,
} = {}) {
  const activeSets = []
  if (uppercase) activeSets.push(CHAR_SETS.uppercase)
  if (lowercase) activeSets.push(CHAR_SETS.lowercase)
  if (numbers) activeSets.push(CHAR_SETS.numbers)
  if (symbols) activeSets.push(CHAR_SETS.symbols)

  // Fallback if user unchecks all categories
  if (activeSets.length === 0) {
    activeSets.push(CHAR_SETS.lowercase, CHAR_SETS.numbers)
  }

  const chosenChars = []

  // Step 1: Guarantee at least ONE character from each active category
  for (const set of activeSets) {
    const charIndex = getSecureRandomInt(set.length)
    chosenChars.push(set[charIndex])
  }

  // Combined character pool for remainder
  const fullPool = activeSets.join('')

  // Step 2: Fill the remaining length with random choices from the combined pool
  while (chosenChars.length < length) {
    const charIndex = getSecureRandomInt(fullPool.length)
    chosenChars.push(fullPool[charIndex])
  }

  // Step 3: Securely shuffle so category-guaranteed positions are completely randomized
  return secureShuffle(chosenChars).join('')
}

/**
 * Generates a 4-word memorable passphrase with secure random words.
 * Example output: "canyon-crystal-silver-beacon"
 */
export function generatePassphrase(wordCount = 4, separator = '-') {
  const words = []
  for (let i = 0; i < wordCount; i++) {
    const index = getSecureRandomInt(PASSPHRASE_WORDS.length)
    words.push(PASSPHRASE_WORDS[index])
  }
  return words.join(separator)
}

