const STORAGE_USERS_KEY = 'auth_demo_users_v1'
const STORAGE_SESSION_KEY = 'auth_demo_session_v1'


async function hashPassword(password, salt = 'auth_ui_salt_2026') {
  const encoder = new TextEncoder()
  const data = encoder.encode(salt + password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}


function getStoredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}


function saveStoredUsers(users) {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users))
}

export async function seedDemoUserIfNeeded() {
  const users = getStoredUsers()
  const demoEmail = 'alex.morgan@example.com'
  const exists = users.some((u) => u.email.toLowerCase() === demoEmail.toLowerCase())

  if (!exists) {
    const passwordHash = await hashPassword('Password123!')
    users.push({
      id: 'demo-user-001',
      name: 'Alex Morgan',
      email: demoEmail,
      passwordHash,
      createdAt: new Date().toISOString(),
    })
    saveStoredUsers(users)
  }
}

// Automatically seed on module load
seedDemoUserIfNeeded().catch(() => { })

export const authService = {
  /**
   * Register a new user account.
   * Rejects duplicate emails. Stores only salted password hashes, never plaintext.
   */
  async register({ name, email, password }) {
    // Simulate real network roundtrip
    await new Promise((resolve) => setTimeout(resolve, 400))

    const normalizedEmail = email.trim().toLowerCase()
    const users = getStoredUsers()

    // Enforce uniqueness constraint
    const existingUser = users.find((u) => u.email.toLowerCase() === normalizedEmail)
    if (existingUser) {
      throw new Error('An account with this email address already exists.')
    }

    const passwordHash = await hashPassword(password)
    const newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    saveStoredUsers(users)

    // Return sanitized user object (never return passwordHash)
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    }
  },

  /**
   * Authenticate user credentials.
   * Enforces generic error messages to prevent user enumeration attacks.
   */
  async login({ email, password, rememberMe = false }) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const normalizedEmail = email.trim().toLowerCase()
    const users = getStoredUsers()
    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail)

    if (!user) {
      throw new Error('Invalid email or password.')
    }

    const inputHash = await hashPassword(password)
    if (inputHash !== user.passwordHash) {
      throw new Error('Invalid email or password.')
    }

    const sessionData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      rememberMe: Boolean(rememberMe),
      loginAt: new Date().toISOString(),
    }

    // Storage strategy based on rememberMe:
    // rememberMe = true -> persisted in localStorage (survives browser restart)
    // rememberMe = false -> stored in sessionStorage (cleared on tab close)
    if (rememberMe) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData))
      sessionStorage.removeItem(STORAGE_SESSION_KEY)
    } else {
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData))
      localStorage.removeItem(STORAGE_SESSION_KEY)
    }

    return sessionData.user
  },

  /**
   * Terminate active session and purge tokens from both storages.
   */
  async logout() {
    await new Promise((resolve) => setTimeout(resolve, 200))
    localStorage.removeItem(STORAGE_SESSION_KEY)
    sessionStorage.removeItem(STORAGE_SESSION_KEY)
  },

  /**
   * Restore current session on page refresh or initial application boot.
   */
  async getSession() {
    // Short tick to ensure asynchronous consistency
    await new Promise((resolve) => setTimeout(resolve, 150))

    try {
      // Check sessionStorage first (current tab priority), then localStorage (persisted)
      const sessionRaw =
        sessionStorage.getItem(STORAGE_SESSION_KEY) ||
        localStorage.getItem(STORAGE_SESSION_KEY)

      if (!sessionRaw) {
        return null
      }

      const session = JSON.parse(sessionRaw)
      if (session && session.user) {
        return session.user
      }
      return null
    } catch {
      return null
    }
  },

  /**
   * Simulated Password Reset Request.
   * In a real system, the server generates a cryptographically random,
   * single-use, time-limited token (e.g., valid for 15 minutes) and emails it.
   */
  async requestPasswordReset({ email }) {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const normalizedEmail = email.trim().toLowerCase()

    // Always return a positive message even if email is not found to prevent user enumeration
    return {
      success: true,
      message: `If an account is associated with ${normalizedEmail}, password reset instructions have been sent.`,
      disclaimer:
        'Demonstration Note: In production, password reset requires a secure backend-issued, time-limited token sent via verified email (e.g. SMTP/SES), not frontend simulation.',
    }
  },
}

