import { useState } from 'react'
import { Lock } from 'lucide-react'
import { AuthLayout } from './components/AuthLayout'
import { FormInput } from './components/FormInput'
import { PasswordInput } from './components/PasswordInput'
import { Button } from './components/Button'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <AuthLayout
      icon={Lock}
      title="Welcome Back"
      subtitle="Enter your credentials to access your account"
      footer={
        <p>
          Don't have an account?{' '}
          <a href="#register" className="auth-link">
            Create account
          </a>
        </p>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          label="Email Address"
          placeholder="name@example.com"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div style={{ marginTop: '1.75rem' }}>
          <Button
            type="submit"
            variant="primary"
            isFullWidth
            isLoading={isLoading}
            loadingText="Signing in..."
          >
            Sign In
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}

export default App
