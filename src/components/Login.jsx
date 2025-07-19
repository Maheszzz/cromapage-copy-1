import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';

export default function Login({ onLogin, onSwitchToSignup }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
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

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (formData.email && formData.password) {
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userEmail', formData.email);
                onLogin();
            } else {
                setErrors({ general: 'Invalid email or password' });
            }
        } catch {
            setErrors({ general: 'Login failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-100 transform transition-all duration-300">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 tracking-tight">
                    Welcome Back
                </h2>
                
                {errors.general && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                        <p className="text-red-700 text-sm font-medium">{errors.general}</p>
                    </div>
                )}
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                            <input
                                id="email"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${
                                    errors.email 
                                        ? 'border-red-300 bg-red-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange('email')}
                                disabled={isLoading}
                                aria-invalid={!!errors.email}
                                aria-describe={errors.email ? 'email-error' : undefined}
                            />
                        </div>
                        {errors.email && (
                            <p id="email-error" className="mt-2 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                            <input
                                id="password"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${
                                    errors.password 
                                        ? 'border-red-300 bg-red-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                type="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleInputChange('password')}
                                disabled={isLoading}
                                aria-invalid={!!errors.password}
                                aria-describers={errors.password ? 'password-error' : undefined}
                            />
                        </div>
                        {errors.password && (
                            <p id="password-error" className="mt-2 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>
                </div>

                <button 
                    type="button"
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg font-medium transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing In...
                        </span>
                    ) : (
                        'Sign In'
                    )}
                </button>

                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={onSwitchToSignup}
                            disabled={isLoading}
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 disabled:opacity-50"
                        >
                            Create one here
                        </button>
                    </p>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                        Demo: Use any email and password (6+ chars)
                    </p>
                </div>
            </div>
        </div>
    );
}