import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/auth.service';
import { useAuth } from '../../contexts/AuthContext';
import { LoginRequest } from '../../types/auth';

// Validation schema
const loginSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Please provide a valid email address'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
}).required();

const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await loginUser(data);
      setUser(response.user);
      navigate('/orders');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred during login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <a href="/register" className="font-medium text-primary-600 hover:text-primary-500">
            create a new account
          </a>
        </p>
      </div>
      
      {error && (
        <div className="p-3 text-sm font-medium text-white bg-red-500 rounded-md">
          {error}
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </a>
              </div>
            </div>
            <div className="mt-1">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="btn-primary w-full flex justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Sign in'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm; 