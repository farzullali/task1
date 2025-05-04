import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ROUTES } from './services/routes.service';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import CreateOrderPage from './pages/CreateOrderPage';
import HomePage from './pages/HomePage';
import ErrorPage from './pages/ErrorPage';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 30000,
    },
  },
});

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route 
        path={ROUTES.ORDERS} 
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.ORDER_DETAIL} 
        element={
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.CREATE_ORDER} 
        element={
          <ProtectedRoute>
            <CreateOrderPage />
          </ProtectedRoute>
        } 
      />
      <Route path={ROUTES.ERROR} element={<ErrorPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
