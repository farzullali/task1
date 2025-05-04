import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/auth.service';
import { RegisterRequest } from '../../types/auth';

// Validation schema
const registerSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Please provide a valid email address'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
    ),
  firstName: yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .matches(
      /^[A-Za-z\s]+$/,
      'First name can only contain letters and spaces'
    ),
  lastName: yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .matches(
      /^[A-Za-z\s]+$/,
      'Last name can only contain letters and spaces'
    ),
}).required();

const RegisterForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  const onSubmit = async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await registerUser(data);
      navigate('/login', { state: { success: 'Registration successful! Please log in.' } });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred during registration.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create a new account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <a href="/login" className="font-medium text-primary-600 hover:text-primary-500">
            sign in to your existing account
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First name
              </label>
              <div className="mt-1">
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last name
              </label>
              <div className="mt-1">
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>
          </div>

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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                type="password"
                autoComplete="new-password"
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
              'Register'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm; 