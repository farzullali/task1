import { userApi, storeTokens } from './api';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  AuthTokens,
  User
} from '../types/auth';

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await userApi.post<LoginResponse>('/auth/login', credentials);
  
  if (response.data.tokens) {
    // Store tokens in localStorage
    storeTokens(response.data.tokens);
    // Store user ID for refresh token requests
    localStorage.setItem('user_id', response.data.user.id);
  }
  
  return response.data;
};

export const registerUser = async (userData: RegisterRequest): Promise<AuthTokens> => {
  const response = await userApi.post<AuthTokens>('/auth/register', userData);
  
  if (response.data) {
    // Store tokens in localStorage
    storeTokens(response.data);
  }
  
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  try {
    await userApi.post('/auth/logout');
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
    const response = await userApi.get<User>(`/users/${userId}`);
    return response.data;
  } catch (error) {
    return null;
  }
}; 