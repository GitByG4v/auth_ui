import { useState } from 'react'
import { Lock } from 'lucide-react'
import { AuthLayout } from './components/AuthLayout'
import { FormInput } from './components/FormInput'
import { PasswordInput } from './components/PasswordInput'
import { Button } from './components/Button'

function App() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [testPassword, setTestPassword] = useState('')
  const [emailError, setEmailError] = useState('')

  const handleSimulatedSubmit = (e) => {
    e.preventDefault()
    if (!testEmail) {
      setEmailError('Email address is required')
      return
    }
    setEmailError('')
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      alert(`UI Component test successful for: ${testEmail}`)
    }, 1200)
  }

  return (
    <AuthLayout
      icon={Lock}
      title="Welcome Back"
      subtitle="Sign in to test our Milestone 2 UI components"
      footer={
        <p>
          Don't have an account?{' '}
          <a href="#register" className="auth-link">
            Create account
          </a>
        </p>
      }
    >
      <form onSubmit={handleSimulatedSubmit} noValidate>
        <FormInput
          label="Email Address"
          placeholder="you@example.com"
          type="email"
          value={testEmail}
          onChange={(e) => {
            setTestEmail(e.target.value)
            if (emailError) setEmailError('')
          }}
          error={emailError}
          hint="We will never share your email with anyone."
          required
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          value={testPassword}
          onChange={(e) => setTestPassword(e.target.value)}
          required
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Button
            type="submit"
            variant="primary"
            isFullWidth
            isLoading={isSubmitting}
            loadingText="Signing in..."
          >
            Sign In (Test Button)
          </Button>

          <Button
            type="button"
            variant="secondary"
            isFullWidth
            onClick={() => setEmailError(emailError ? '' : 'Demonstration error state')}
          >
            Toggle Error State
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}

export default App
