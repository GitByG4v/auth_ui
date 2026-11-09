import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, AlertCircle } from 'lucide-react'
import { AuthLayout } from '../components/AuthLayout'
import { FormInput } from '../components/FormInput'
import { PasswordInput } from '../components/PasswordInput'
import { Button } from '../components/Button'
import { loginSchema } from '../utils/validation'

export function Login({ onNavigate, onSubmitSuccess, serverError }) {
  const [localError, setLocalError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onTouched', // Validates on blur/interaction
  })

  const onSubmit = async (data) => {
    setLocalError(null)
    try {
      if (onSubmitSuccess) {
        await onSubmitSuccess(data)
      } else {
        // Milestone 3 preview behavior
        await new Promise((resolve) => setTimeout(resolve, 800))
        alert(`Logged in preview successfully for: ${data.email}\nRemember Me: ${data.rememberMe}`)
      }
    } catch (err) {
      setLocalError(err.message || 'Failed to sign in. Please verify your credentials.')
    }
  }

  const errorMessage = serverError || localError

  return (
    <AuthLayout
      icon={Lock}
      title="Welcome Back"
      subtitle="Enter your credentials to access your account"
      footer={
        <p>
          Don't have an account?{' '}
          <button
            type="button"
            className="auth-link"
            style={{ background: 'none', border: 'none', font: 'inherit', padding: 0 }}
            onClick={() => onNavigate && onNavigate('register')}
          >
            Create account
          </button>
        </p>
      }
    >
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

          <button
            type="button"
            className="auth-link"
            style={{ background: 'none', border: 'none', font: 'inherit', fontSize: '0.875rem' }}
            onClick={() => onNavigate && onNavigate('forgot')}
          >
            Forgot password?
          </button>
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

