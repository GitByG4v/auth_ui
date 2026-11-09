const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

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

export function getSecureRandomInt(max: number): number {
  if (max <= 0) return 0
  const randomBuffer = new Uint32Array(1)
  const maxUint = 0xffffffff
  const limit = maxUint - (maxUint % max)

  let randomVal: number
  do {
    crypto.getRandomValues(randomBuffer)
    randomVal = randomBuffer[0]
  } while (randomVal >= limit)

  return randomVal % max
}

export function secureShuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1)
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

export interface PasswordGeneratorOptions {
  length?: number
  uppercase?: boolean
  lowercase?: boolean
  numbers?: boolean
  symbols?: boolean
}

export function generatePassword({
  length = 16,
  uppercase = true,
  lowercase = true,
  numbers = true,
  symbols = true,
}: PasswordGeneratorOptions = {}): string {
  const activeSets: string[] = []
  if (uppercase) activeSets.push(CHAR_SETS.uppercase)
  if (lowercase) activeSets.push(CHAR_SETS.lowercase)
  if (numbers) activeSets.push(CHAR_SETS.numbers)
  if (symbols) activeSets.push(CHAR_SETS.symbols)

  if (activeSets.length === 0) {
    activeSets.push(CHAR_SETS.lowercase, CHAR_SETS.numbers)
  }

  const chosenChars: string[] = []

  for (const set of activeSets) {
    const charIndex = getSecureRandomInt(set.length)
    chosenChars.push(set[charIndex])
  }

  const fullPool = activeSets.join('')

  while (chosenChars.length < length) {
    const charIndex = getSecureRandomInt(fullPool.length)
    chosenChars.push(fullPool[charIndex])
  }

  return secureShuffle(chosenChars).join('')
}

export function generatePassphrase(wordCount: number = 4, separator: string = '-'): string {
  const words: string[] = []
  for (let i = 0; i < wordCount; i++) {
    const index = getSecureRandomInt(PASSPHRASE_WORDS.length)
    words.push(PASSPHRASE_WORDS[index])
  }
  return words.join(separator)
}

