export interface User {
  id: string
  name: string
  email: string
}

export interface StoredUser extends User {
  passwordHash: string
  createdAt: string
}

export interface SessionData {
  user: User
  rememberMe: boolean
  loginAt: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  clearError: () => void
  login: (credentials: { email: string; password: string; rememberMe?: boolean }) => Promise<User>
  register: (data: { name: string; email: string; password: string }) => Promise<User>
  logout: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>
}

export interface ThemeContextType {
  theme: 'light' | 'dark'
  isDark: boolean
  toggleTheme: () => void
}

export interface Requirement {
  id: string
  label: string
  met: boolean
}

export interface PasswordAnalysis {
  score: number
  label: string
  color: string
  requirements: Requirement[]
  issues: string[]
  crackEffort: string
  suggestion: string
}

