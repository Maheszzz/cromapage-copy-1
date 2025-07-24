import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled component for the gradient background
const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #e0eafc, #cfdef3, #e0e7ff)',
  padding: theme.spacing(2, 4),
}));

// Styled component for the card
const LoginCard = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '400px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[10],
  padding: theme.spacing(4),
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

export default function Login({ onLogin, onSwitchToSignup }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setGeneralError('');

    try {
      // Simulate API call (replace with actual API later)
      await new Promise((resolve, reject) => {
        const fail = false; // Set to true to simulate error
        setTimeout(() => (fail ? reject(new Error('Simulated error')) : resolve()), 1000);
      });

      const isValid = data.email && data.password.length >= 6;

      if (isValid) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', data.email);
        reset(); // Reset before redirect
        onLogin(); // Trigger parent callback
      } else {
        setError('email', { message: 'Invalid email or password' });
        setError('password', { message: ' ' }); // Highlight field in red
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
    <GradientBackground>
      <LoginCard>
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Welcome Back
        </Typography>

        {generalError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {generalError}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {/* Email Field */}
            <TextField
              fullWidth
              id="email"
              label="Email Address"
              variant="outlined"
              disabled={isLoading}
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              })}
              InputProps={{
                startAdornment: <Mail sx={{ color: 'action.active', mr: 1 }} />,
              }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              disabled={isLoading}
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
              })}
              InputProps={{
                startAdornment: <Lock sx={{ color: 'action.active', mr: 1 }} />,
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 2,
                py: 1.5,
                background: 'linear-gradient(90deg, #4b5bf7, #8b5cf6)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #364fc7, #7c3aed)',
                },
                '&:disabled': {
                  opacity: 0.5,
                  cursor: 'not-allowed',
                },
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} /> Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </Stack>
        </form>

        <Typography align="center" sx={{ mt: 2, color: 'text.secondary' }}>
          Don&apos;t have an account?{' '}
          <Button
            onClick={onSwitchToSignup}
            disabled={isLoading}
            sx={{ color: 'primary.main', textTransform: 'none', '&:hover': { color: 'primary.dark' } }}
          >
            Create one here
          </Button>
        </Typography>

        <Typography align="center" sx={{ mt: 2, color: 'text.disabled', fontSize: '0.75rem' }}>
          Demo: Use any email and password (6+ chars)
        </Typography>
      </LoginCard>
    </GradientBackground>
  );
}