import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginForm from '../components/forms/LoginForm';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const state = location.state as { success?: string };
  const successMessage = state?.success;

  // Redirect to orders page if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/orders" />;
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12">
        {successMessage && (
          <motion.div
            className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md w-full max-w-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {successMessage}
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LoginForm />
        </motion.div>
      </div>
    </Layout>
  );
};

export default LoginPage; 