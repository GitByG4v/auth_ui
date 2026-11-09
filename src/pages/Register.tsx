import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus, User, Mail, Lock, Sparkles, ArrowRight, AlertCircle } from 'lucide-react'
import { AuthLayout } from '../components/AuthLayout'
import { FormInput } from '../components/FormInput'
import { PasswordInput } from '../components/PasswordInput'
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter'
import { PasswordGenerator } from '../components/PasswordGenerator'
import { Button } from '../components/Button'
import { registerSchema, RegisterFormData } from '../utils/validation'
import { useAuth } from '../context/AuthContext'

export function Register() {
  const { register: registerUser, isAuthenticated, error: contextError, clearError } = useAuth()
  const [localError, setLocalError] = useState<string | null>(null)
  const [showGenerator, setShowGenerator] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  })

  const watchedPassword = watch('password') || ''

  const handleApplyGeneratedPassword = (generated: string) => {
    setValue('password', generated, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
    setValue('confirmPassword', generated, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
    setShowGenerator(false)
  }

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setLocalError(null)
    clearError()
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      navigate('/login', {
        state: {
          registeredEmail: data.email,
          message: 'Account created successfully! Please sign in with your credentials.',
        },
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please check your information.'
      setLocalError(message)
    }
  }

  const errorMessage = contextError || localError

  return (
    <AuthLayout
      icon={UserPlus}
      title="Create Account"
      subtitle="Sign up to get started with your secure account"
      footer={
        <p>
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
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
          labelIcon={User}
          leftIcon={User}
          placeholder="Alex Morgan"
          type="text"
          autoComplete="name"
          required
          error={errors.name?.message}
          {...register('name')}
        />

        <FormInput
          label="Email Address"
          labelIcon={Mail}
          leftIcon={Mail}
          placeholder="name@example.com"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          label="Password"
          labelIcon={Lock}
          leftIcon={Lock}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          error={errors.password?.message}
          {...register('password')}
        />

        <PasswordStrengthMeter password={watchedPassword} />

        <div style={{ margin: '0.35rem 0 1rem 0', textAlign: 'left' }}>
          <button
            type="button"
            className="auth-link"
            style={{
              background: 'none',
              border: 'none',
              font: 'inherit',
              fontSize: '0.8125rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              padding: 0,
            }}
            onClick={() => setShowGenerator((prev) => !prev)}
          >
            <Sparkles size={14} />
            <span>
              {showGenerator ? 'Hide password generator' : 'Need a strong password? Generate one'}
            </span>
          </button>
        </div>

        {showGenerator && (
          <PasswordGenerator
            onSelectPassword={handleApplyGeneratedPassword}
            onClose={() => setShowGenerator(false)}
          />
        )}

        <PasswordInput
          label="Confirm Password"
          labelIcon={Lock}
          leftIcon={Lock}
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
            <span>Create Account</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}

