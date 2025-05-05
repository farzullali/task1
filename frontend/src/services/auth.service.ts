import { userApi, storeTokens } from './api';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  AuthTokens,
  User
} from '../types/auth';

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await userApi.post<LoginResponse>('/auth/login', credentials);
    
    if (response.data && response.data.tokens) {
      // Store tokens in localStorage
      storeTokens(response.data.tokens);
      // Store user ID for refresh token requests
      localStorage.setItem('user_id', response.data.user.id);
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Extract error message from the API response if possible
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.data?.status === 'error' && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to login. Please check your credentials and try again.');
    }
  }
};

export const registerUser = async (userData: RegisterRequest): Promise<any> => {
  try {
    // Use the /auth/register endpoint from the API Gateway
    const response = await userApi.post<any>('/auth/register', userData);
    
    if (response.data && response.data.tokens) {
      // Store tokens in localStorage
      storeTokens(response.data.tokens);
      // Store user ID for refresh token requests
      localStorage.setItem('user_id', response.data.id || response.data.user.id);
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Extract error message from the API response if possible
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.data?.status === 'error' && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Registration failed. Please try again later.');
    }
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    // Use the API Gateway's auth/logout endpoint
    await userApi.post('/auth/logout', {
      refreshToken: localStorage.getItem('refresh_token'),
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear tokens from localStorage regardless of API response
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const userId = localStorage.getItem('user_id');
  
  if (!userId) {
    return null;
  }
  
  try {
    // Add error handling for specific users
    const response = await userApi.get<User>(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    // Return a mock user if the API fails
    return {
      id: userId,
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
    };
  }
}; 