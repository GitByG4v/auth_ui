import type { User, StoredUser, SessionData } from '../types/auth'

const STORAGE_USERS_KEY = 'auth_demo_users_v1'
const STORAGE_SESSION_KEY = 'auth_demo_session_v1'

async function hashPassword(password: string, salt: string = 'auth_ui_salt_2026'): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(salt + password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users))
}

export async function seedDemoUserIfNeeded(): Promise<void> {
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

seedDemoUserIfNeeded().catch(() => {})

export const authService = {
  async register({ name, email, password }: { name: string; email: string; password: string }): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const normalizedEmail = email.trim().toLowerCase()
    const users = getStoredUsers()

    const existingUser = users.find((u) => u.email.toLowerCase() === normalizedEmail)
    if (existingUser) {
      throw new Error('An account with this email address already exists.')
    }

    const passwordHash = await hashPassword(password)
    const newUser: StoredUser = {
      id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : String(Date.now()),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    saveStoredUsers(users)

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    }
  },

  async login({ email, password, rememberMe = false }: { email: string; password: string; rememberMe?: boolean }): Promise<User> {
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

    const sessionData: SessionData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      rememberMe: Boolean(rememberMe),
      loginAt: new Date().toISOString(),
    }

    if (rememberMe) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData))
      sessionStorage.removeItem(STORAGE_SESSION_KEY)
    } else {
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData))
      localStorage.removeItem(STORAGE_SESSION_KEY)
    }

    return sessionData.user
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    localStorage.removeItem(STORAGE_SESSION_KEY)
    sessionStorage.removeItem(STORAGE_SESSION_KEY)
  },

  async getSession(): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 150))

    try {
      const sessionRaw =
        sessionStorage.getItem(STORAGE_SESSION_KEY) ||
        localStorage.getItem(STORAGE_SESSION_KEY)

      if (!sessionRaw) {
        return null
      }

      const session: SessionData = JSON.parse(sessionRaw)
      return session?.user || null
    } catch {
      return null
    }
  },

  async requestPasswordReset({ email }: { email: string }): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const normalizedEmail = email.trim().toLowerCase()

    return {
      success: true,
      message: `If an account is associated with ${normalizedEmail}, password reset instructions have been sent.`,
    }
  },
}

