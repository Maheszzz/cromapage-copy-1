import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function SignUp({ onSignup, onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password strength checker
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

    // Input validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (formData.email && formData.password) {
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userEmail', formData.email);
                sessionStorage.setItem('userName', `${formData.firstName} ${formData.lastName}`);
                onSignup();
            } else {
                setErrors({ general: 'Registration failed. Please try again.' });
            }
        } catch {
            setErrors({ general: 'Registration failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-100 to-purple-100 px-4 py-8 sm:px-6 lg:px-8">
            {/* Glassmorphism card with subtle border and shadow */}
            <div className="w-full max-w-lg bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 sm:p-10 border border-white/30 transform transition-all duration-500 hover:scale-[1.02]">
                <h2 className="text-3xl font-bold mb-2 text-center text-gray-900 tracking-tight font-sans animate-fade-in">
                    Create Account
                </h2>
                <p className="text-gray-600 text-center mb-8 font-sans text-sm animate-fade-in">
                    Join us and get started today
                </p>

                {errors.general && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-fade-in">
                        <p className="text-red-700 text-sm font-medium font-sans">{errors.general}</p>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                                First Name
                            </label>
                            <div className="relative">
                                <User className="absolute top-3.5 left-3 w-5 h-5 text-gray-400" />
                                <input
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-50/50 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 font-sans text-sm ${
                                        errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    type="text"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={handleInputChange('firstName')}
                                    disabled={isLoading}
                                    aria-invalid={!!errors.firstName}
                                    aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                                />
                            </div>
                            {errors.firstName && (
                                <p id="firstName-error" className="mt-2 text-sm text-red-600 font-sans">{errors.firstName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                                Last Name
                            </label>
                            <div className="relative">
                                <User className="absolute top-3.5 left-3 w-5 h-5 text-gray-400" />
                                <input
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-50/50 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 font-sans text-sm ${
                                        errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    type="text"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleInputChange('lastName')}
                                    disabled={isLoading}
                                    aria-invalid={!!errors.lastName}
                                    aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                                />
                            </div>
                            {errors.lastName && (
                                <p id="lastName-error" className="mt-2 text-sm text-red-600 font-sans">{errors.lastName}</p>
                            )}
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute top-3.5 left-3 w-5 h-5 text-gray-400" />
                            <input
                                className={`w-full pl-10 pr-4 py-3 bg-gray-50/50 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 font-sans text-sm ${
                                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                                type="email"
                                placeholder="john.doe@example.com"
                                value={formData.email}
                                onChange={handleInputChange('email')}
                                disabled={isLoading}
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                            />
                        </div>
                        {errors.email && (
                            <p id="email-error" className="mt-2 text-sm text-red-600 font-sans">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute top-3.5 left-3 w-5 h-5 text-gray-400" />
                            <input
                                className={`w-full pl-10 pr-12 py-3 bg-gray-50/50 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 font-sans text-sm ${
                                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={handleInputChange('password')}
                                disabled={isLoading}
                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? 'password-error' : undefined}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {formData.password && (
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
                            <p id="password-error" className="mt-2 text-sm text-red-600 font-sans">{errors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute top-3.5 left-3 w-5 h-5 text-gray-400" />
                            <input
                                className={`w-full pl-10 pr-12 py-3 bg-gray-50/50 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 font-sans text-sm ${
                                    errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange('confirmPassword')}
                                disabled={isLoading}
                                aria-invalid={!!errors.confirmPassword}
                                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p id="confirmPassword-error" className="mt-2 text-sm text-red-600 font-sans">{errors.confirmPassword}</p>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSignup}
                    disabled={isLoading}
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
            </div>
        </div>
    );
}