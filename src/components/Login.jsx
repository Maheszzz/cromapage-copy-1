import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';

// Spinner component for cleaner JSX
const Spinner = () => (
    <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        ></circle>
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
    </svg>
);

export default function Login({ onLogin, onSwitchToSignup }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');

    const onSubmit = async (data) => {
        setIsLoading(true);
        setGeneralError('');

        try {
            // Simulate API call (replace this with actual API later)
            await new Promise((resolve, reject) => {
                const fail = false; // set to true to simulate error
                setTimeout(() => (fail ? reject(new Error('Simulated error')) : resolve()), 1000);
            });

            const isValid = data.email && data.password.length >= 6;

            if (isValid) {
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userEmail', data.email);
                reset(); // reset before redirect
                onLogin(); // trigger parent callback
            } else {
                setError('email', { message: 'Invalid email or password' });
                setError('password', { message: ' ' }); // to highlight field in red
            }
        } catch (error) {
            console.error('Login error:', error);
            const message =
                error?.response?.data?.message || error.message || 'Login failed. Please try again.';
            setGeneralError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-100 to-purple-100 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 sm:p-10 border border-white/30 transition-all duration-500 hover:scale-[1.02]">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 font-sans animate-fade-in">
                    Welcome Back
                </h2>

                {generalError && (
                    <div
                        className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-fade-in"
                        aria-live="polite"
                    >
                        <p className="text-red-700 text-sm font-medium font-sans">{generalError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute top-3.5 left-3 w-5 h-5 text-gray-400" />
                            <input
                                id="email"
                                type="email"
                                autoFocus
                                placeholder="Enter your email"
                                disabled={isLoading}
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Please enter a valid email address'
                                    }
                                })}
                                className={`w-full pl-10 pr-4 py-3 bg-gray-50/50 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 font-sans text-sm ${
                                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                            />
                        </div>
                        {errors.email && (
                            <p id="email-error" className="mt-2 text-sm text-red-600 font-sans">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute top-3.5 left-3 w-5 h-5 text-gray-400" />
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                disabled={isLoading}
                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? 'password-error' : undefined}
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters long'
                                    }
                                })}
                                className={`w-full pl-10 pr-4 py-3 bg-gray-50/50 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 font-sans text-sm ${
                                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                            />
                        </div>
                        {errors.password && (
                            <p id="password-error" className="mt-2 text-sm text-red-600 font-sans">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg font-medium transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 font-sans"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <Spinner /> Signing In...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm font-sans">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={onSwitchToSignup}
                            disabled={isLoading}
                            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 disabled:opacity-50"
                        >
                            Create one here
                        </button>
                    </p>
                </div>

                <div className="mt-6 p-4 bg-gray-50/50 rounded-lg border border-gray-200/50">
                    <p className="text-xs text-gray-500 text-center font-sans">
                        Demo: Use any email and password (6+ chars)
                    </p>
                </div>
            </div>
        </div>
    );
}
