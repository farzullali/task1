import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import CreateOrderForm from '../components/forms/CreateOrderForm';

const CreateOrderPage: React.FC = () => {
  return (
    <Layout>
      <motion.div
        className="flex flex-col items-center justify-center py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <CreateOrderForm />
      </motion.div>
    </Layout>
  );
};

export default CreateOrderPage; 