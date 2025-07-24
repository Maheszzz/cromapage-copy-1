import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const signUpSchema = yup.object().shape({
  firstName: yup.string().required('First name is required').min(2, 'Minimum 2 characters'),
  lastName: yup.string().required('Last name is required').min(2, 'Minimum 2 characters'),
  email: yup.string().required('Email is required').email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .matches(/[A-Z]/, 'Must include an uppercase letter')
    .matches(/[a-z]/, 'Must include a lowercase letter')
    .matches(/[0-9]/, 'Must include a number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must include a special character'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

export default function SignUp({ onSignup, onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(signUpSchema),
    mode: 'onChange',
  });

  const password = watch('password', '');

  const getPasswordStrength = (password) => {
    if (password.length < 6) return { score: 0, text: 'Too short', color: 'text-red-500', bgColor: 'bg-red-500' };
    if (password.length < 8) return { score: 1, text: 'Weak', color: 'text-orange-500', bgColor: 'bg-orange-500' };

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

    if (score < 2) return { score: 1, text: 'Weak', color: 'text-orange-500', bgColor: 'bg-orange-500' };
    if (score < 4) return { score: 2, text: 'Medium', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
    return { score: 3, text: 'Strong', color: 'text-green-500', bgColor: 'bg-green-500' };
  };

  const handleSignup = async (data) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (data.email && data.password) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', data.email);
        sessionStorage.setItem('userName', `${data.firstName} ${data.lastName}`);
        onSignup();
      } else {
        // Errors are handled by yup, so this should not occur
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-100 to-purple-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 sm:p-10 border border-white/30 transform transition-all duration-500 hover:scale-[1.02]">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-900 tracking-tight font-sans animate-fade-in">
          Create Account
        </h2>
        <p className="text-gray-600 text-center mb-8 font-sans text-sm animate-fade-in">
          Join us and get started today
        </p>

        <form onSubmit={handleSubmit(handleSignup)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                First Name
              </label>
              <div className="relative">
                <User className="absolute top-3.5 left-3 w-5 h-5 text-gray-400" />
                <input
                  id="firstName"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50/50 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 font-sans text-sm ${
                    errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  type="text"
                  placeholder="John"
                  {...register('firstName')}
                  disabled={isLoading}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                />
              </div>
              {errors.firstName && (
                <p id="firstName-error" className="mt-2 text-sm text-red-600 font-sans">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute top-3.5 left-3 w-5 h-5 text-gray-400" />
                <input
                  id="lastName"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50/50 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 font-sans text-sm ${
                    errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  type="text"
                  placeholder="Doe"
                  {...register('lastName')}
                  disabled={isLoading}
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                />
              </div>
              {errors.lastName && (
                <p id="lastName-error" className="mt-2 text-sm text-red-600 font-sans">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-sans">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute top-3.5 left-3 w-5 h-5 text-gray-400" />
              <input
                id="email"
                className={`w-full pl-10 pr-4 py-3 bg-gray-50/50 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 font-sans text-sm ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                type="email"
                placeholder="john.doe@example.com"
                {...register('email')}
                disabled={isLoading}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="mt-2 text-sm text-red-600 font-sans">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 font-sans">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute top-3.5 left-3 w-5 h-5 text-gray-400" />
              <input
                id="password"
                className={`w-full pl-10 pr-12 py-3 bg-gray-50/50 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 font-sans text-sm ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                {...register('password')}
                disabled={isLoading}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {FormData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm font-sans">
                  <span className="text-gray-600">Password strength:</span>
                  <span className={passwordStrength.color}>{passwordStrength.text}</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.score === 0 ? 'bg-red-500 w-1/6' :
                      passwordStrength.score === 1 ? 'bg-orange-500 w-1/3' :
                      passwordStrength.score === 2 ? 'bg-yellow-500 w-2/3' :
                      'bg-green-500 w-full'
                    }`}
                  />
                </div>
              </div>
            )}
            {errors.password && (
              <p id="password-error" className="mt-2 text-sm text-red-600 font-sans">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2 font-sans">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute top-3.5 left-3 w-5 h-5 text-gray-400" />
              <input
                id="confirmPassword"
                className={`w-full pl-10 pr-12 py-3 bg-gray-50/50 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 font-sans text-sm ${
                  errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                disabled={isLoading}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="mt-2 text-sm text-red-600 font-sans">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !isValid}
            className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg font-medium transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 font-sans"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm font-sans">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                disabled={isLoading}
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 disabled:opacity-50"
              >
                Sign in here
              </button>
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-50/50 rounded-lg border border-gray-200/50">
            <p className="text-xs text-gray-500 text-center font-sans">
              Demo: Fill in all fields with valid data to create account
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}