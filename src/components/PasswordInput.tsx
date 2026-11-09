import { useState, forwardRef } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { FormInput, FormInputProps } from './FormInput'

export interface PasswordInputProps extends Omit<FormInputProps, 'type' | 'rightElement'> {}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  {
    label = 'Password',
    labelIcon = Lock,
    leftIcon = Lock,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <FormInput
      ref={ref}
      label={label}
      labelIcon={labelIcon}
      leftIcon={leftIcon}
      type={showPassword ? 'text' : 'password'}
      rightElement={
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="password-toggle-btn"
          tabIndex={-1}
        >
          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      }
      {...props}
    />
  )
})

