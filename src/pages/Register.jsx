import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus, AlertCircle } from 'lucide-react'
import { AuthLayout } from '../components/AuthLayout'
import { FormInput } from '../components/FormInput'
import { PasswordInput } from '../components/PasswordInput'
import { Button } from '../components/Button'
import { registerSchema } from '../utils/validation'

export function Register({ onNavigate, onSubmitSuccess, serverError }) {
  const [localError, setLocalError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  })

  const onSubmit = async (data) => {
    setLocalError(null)
    try {
      if (onSubmitSuccess) {
        await onSubmitSuccess(data)
      } else {
        // Milestone 3 preview behavior
        await new Promise((resolve) => setTimeout(resolve, 800))
        alert(`Account registered preview successfully for: ${data.name} (${data.email})`)
        if (onNavigate) onNavigate('login')
      }
    } catch (err) {
      setLocalError(err.message || 'Registration failed. Please check your information.')
    }
  }

  const errorMessage = serverError || localError

  return (
    <AuthLayout
      icon={UserPlus}
      title="Create Account"
      subtitle="Sign up to start your secure session"
      footer={
        <p>
          Already have an account?{' '}
          <button
            type="button"
            className="auth-link"
            style={{ background: 'none', border: 'none', font: 'inherit', padding: 0 }}
            onClick={() => onNavigate && onNavigate('login')}
          >
            Sign in
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
          label="Full Name"
          placeholder="Jane Doe"
          type="text"
          autoComplete="name"
          required
          error={errors.name?.message}
          {...register('name')}
        />

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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          error={errors.password?.message}
          {...register('password')}
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div style={{ marginTop: '1.75rem' }}>
          <Button
            type="submit"
            variant="primary"
            isFullWidth
            isLoading={isSubmitting}
            loadingText="Creating account..."
          >
            Create Account
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
