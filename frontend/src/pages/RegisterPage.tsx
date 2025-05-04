import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import RegisterForm from '../components/forms/RegisterForm';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Redirect to orders page if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/orders" />;
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <RegisterForm />
        </motion.div>
      </div>
    </Layout>
  );
};

export default RegisterPage; 