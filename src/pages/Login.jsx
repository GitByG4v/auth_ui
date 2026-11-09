import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { AuthLayout } from '../components/AuthLayout'
import { FormInput } from '../components/FormInput'
import { PasswordInput } from '../components/PasswordInput'
import { Button } from '../components/Button'
import { loginSchema } from '../utils/validation'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const { login, isAuthenticated, error: contextError, clearError } = useAuth()
  const [localError, setLocalError] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Where to navigate after login: return to the attempted URL, or fallback to /dashboard
  const from = location.state?.from?.pathname || '/dashboard'
  const flashMessage = location.state?.message

  // If already logged in, redirect away from login page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: location.state?.registeredEmail || '',
      password: '',
      rememberMe: false,
    },
    mode: 'onTouched',
  })

  const onSubmit = async (data) => {
    setLocalError(null)
    clearError()
    try {
      await login(data)
      navigate(from, { replace: true })
    } catch (err) {
      setLocalError(err.message || 'Failed to sign in. Please verify your credentials.')
    }
  }

  const errorMessage = contextError || localError

  return (
    <AuthLayout
      icon={Lock}
      title="Welcome Back"
      subtitle="Enter your credentials to access your account"
      footer={
        <p>
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Create account
          </Link>
        </p>
      }
    >
      {flashMessage && (
        <div className="alert-banner alert-success" role="status">
          <CheckCircle2 size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
          <span>{flashMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="alert-banner alert-danger" role="alert">
          <AlertCircle size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormInput
          label="Email Address"
          placeholder="name@example.com"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="form-row-between">
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              className="form-checkbox"
              {...register('rememberMe')}
            />
            <span>Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="auth-link"
            style={{ fontSize: '0.875rem' }}
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          isFullWidth
          isLoading={isSubmitting}
          loadingText="Signing in..."
        >
          Sign In
        </Button>
      </form>
    </AuthLayout>
  )
}
