import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema, forgotPasswordSchema } from './validation'

describe('Validation Schemas (Zod)', () => {
  describe('loginSchema', () => {
    it('rejects invalid email formats and empty inputs', () => {
      const result = loginSchema.safeParse({ email: 'not-an-email', password: '' })
      expect(result.success).toBe(false)
      if (!result.success) {
        const issues = result.error.issues.map((i) => i.path[0])
        expect(issues).toContain('email')
        expect(issues).toContain('password')
      }
    })

    it('accepts valid email and password with default rememberMe', () => {
      const result = loginSchema.safeParse({ email: 'user@example.com', password: 'secretPassword123!' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.rememberMe).toBe(false)
      }
    })
  })

  describe('registerSchema', () => {
    it('fails when passwords do not match', () => {
      const result = registerSchema.safeParse({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'ValidPassword123!',
        confirmPassword: 'MismatchPassword123!',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        const passwordIssue = result.error.issues.find((i) => i.path[0] === 'confirmPassword')
        expect(passwordIssue?.message).toBe('Passwords do not match')
      }
    })

    it('fails when password does not meet security rules', () => {
      // Missing uppercase, number, symbol
      const result = registerSchema.safeParse({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'lowercaseonly',
        confirmPassword: 'lowercaseonly',
      })
      expect(result.success).toBe(false)
    })

    it('passes for complete, valid registration credentials', () => {
      const result = registerSchema.safeParse({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'StrongP@ssw0rd!',
        confirmPassword: 'StrongP@ssw0rd!',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('forgotPasswordSchema', () => {
    it('validates email correctly', () => {
      expect(forgotPasswordSchema.safeParse({ email: '' }).success).toBe(false)
      expect(forgotPasswordSchema.safeParse({ email: 'valid@example.com' }).success).toBe(true)
    })
  })
})

