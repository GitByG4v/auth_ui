import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound, Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { AuthLayout } from '../components/AuthLayout'
import { FormInput } from '../components/FormInput'
import { Button } from '../components/Button'
import { forgotPasswordSchema, ForgotPasswordFormData } from '../utils/validation'
import { useAuth } from '../context/AuthContext'

export function ForgotPassword() {
  const { requestPasswordReset } = useAuth()
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onTouched',
  })

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    try {
      const response = await requestPasswordReset(data.email)
      setResult(response)
    } catch {
      setResult({
        success: true,
        message: `If an account exists for ${data.email}, instructions were dispatched.`,
      })
    }
  }

  return (
    <AuthLayout
      icon={KeyRound}
      title="Reset Password"
      subtitle="Enter your email to receive recovery instructions"
      footer={
        <Link
          to="/login"
          className="auth-link"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to sign in</span>
        </Link>
      }
    >
      {result ? (
        <div>
          <div className="alert-banner alert-success" role="status">
            <CheckCircle2 size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
            <span>{result.message}</span>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button type="button" variant="primary" isFullWidth>
                Return to Sign In
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

          <div style={{ marginTop: '1.75rem' }}>
            <Button
              type="submit"
              variant="primary"
              isFullWidth
              isLoading={isSubmitting}
              loadingText="Sending reset link..."
            >
              <span>Send Reset Link</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </div>
        </form>
      )}
    </AuthLayout>
  )
}

