import { describe, it, expect, beforeEach } from 'vitest'
import { authService, seedDemoUserIfNeeded } from './authService'

const createStorageMock = () => {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => {
      store[key] = String(val)
    },
    removeItem: (key) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
}

describe('authService (Mock Authentication Layer)', () => {
  beforeEach(async () => {
    globalThis.localStorage = createStorageMock()
    globalThis.sessionStorage = createStorageMock()
    await seedDemoUserIfNeeded()
  })

  it('authenticates demo user with correct credentials', async () => {
    const user = await authService.login({
      email: 'alex.morgan@example.com',
      password: 'Password123!',
      rememberMe: false,
    })

    expect(user).toBeDefined()
    expect(user.name).toBe('Alex Morgan')
    expect(user.email).toBe('alex.morgan@example.com')
  })

  it('rejects login with incorrect password', async () => {
    await expect(
      authService.login({
        email: 'alex.morgan@example.com',
        password: 'WrongPassword!',
      })
    ).rejects.toThrow('Invalid email or password.')
  })

  it('registers a new user and denies duplicate emails', async () => {
    const newUser = await authService.register({
      name: 'Karthik Raja',
      email: 'karthik@example.com',
      password: 'SecurePassword123!',
    })

    expect(newUser.name).toBe('Karthik Raja')
    expect(newUser.email).toBe('karthik@example.com')

    // Attempt duplicate registration
    await expect(
      authService.register({
        name: 'Another Karthik',
        email: 'karthik@example.com',
        password: 'AnotherPassword123!',
      })
    ).rejects.toThrow('An account with this email address already exists.')
  })

  it('never stores plaintext passwords in storage', async () => {
    await authService.register({
      name: 'Dev Security',
      email: 'security@example.com',
      password: 'PlaintextSuperSecret!',
    })

    const rawStorage = globalThis.localStorage.getItem('auth_demo_users_v1')
    expect(rawStorage).not.toContain('PlaintextSuperSecret!')
  })

  it('persists and restores session via getSession', async () => {
    await authService.login({
      email: 'alex.morgan@example.com',
      password: 'Password123!',
      rememberMe: true,
    })

    const sessionUser = await authService.getSession()
    expect(sessionUser).not.toBeNull()
    expect(sessionUser?.email).toBe('alex.morgan@example.com')

    await authService.logout()
    const emptySession = await authService.getSession()
    expect(emptySession).toBeNull()
  })

  it('simulates password reset without email enumeration', async () => {
    const response = await authService.requestPasswordReset({
      email: 'unknown.user@example.com',
    })
    expect(response.success).toBe(true)
    expect(response.message).toContain('password reset instructions have been sent')
  })
})
