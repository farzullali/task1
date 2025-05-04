import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { AuthTokens, RefreshTokenRequest } from '../types/auth';

// API URLs
const USER_SERVICE_URL = 'http://localhost:3001';
const ORDER_SERVICE_URL = 'http://localhost:3002';

// Create axios instances for each service
export const userApi = axios.create({
  baseURL: USER_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const orderApi = axios.create({
  baseURL: ORDER_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Token storage in localStorage
const getAccessToken = (): string | null => localStorage.getItem('access_token');
const getRefreshToken = (): string | null => localStorage.getItem('refresh_token');
const getUserId = (): string | null => localStorage.getItem('user_id');

const storeTokens = (tokens: AuthTokens): void => {
  localStorage.setItem('access_token', tokens.access_token);
  localStorage.setItem('refresh_token', tokens.refresh_token);
};

const clearTokens = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_id');
};

// Refresh token function
const refreshTokens = async (): Promise<AuthTokens> => {
  const userId = getUserId();
  const refreshToken = getRefreshToken();
  
  if (!userId || !refreshToken) {
    clearTokens();
    throw new Error('No refresh token available');
  }
  
  const refreshRequest: RefreshTokenRequest = {
    userId,
    refreshToken,
  };
  
  try {
    const response = await axios.post<AuthTokens>(
      `${USER_SERVICE_URL}/auth/refresh`,
      refreshRequest,
      {
        withCredentials: true,
      }
    );
    
    storeTokens(response.data);
    return response.data;
  } catch (error) {
    clearTokens();
    throw error;
  }
};

// Add request interceptors
const setupInterceptors = (api: typeof userApi) => {
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      
      // Only try to refresh the token once
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const newTokens = await refreshTokens();
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
          }
          
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh token fails, redirect to login
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
};

// Setup interceptors for both APIs
setupInterceptors(userApi);
setupInterceptors(orderApi);

export { storeTokens, clearTokens, getUserId }; 