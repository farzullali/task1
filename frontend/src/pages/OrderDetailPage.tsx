import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useOrder } from '../hooks/useOrders';
import { RoutesService } from '../services/routes.service';

const OrderDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { data: order, isLoading, error: queryError } = useOrder(id);
  const [error, setError] = useState<string | null>(null);

  // Handle query errors
  useEffect(() => {
    if (queryError) {
      // Just convert to string without type checking
      setError(String(queryError));
    }
  }, [queryError]);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          <p className="font-medium">Error loading order</p>
          <p className="mt-1">{error || 'Order not found'}</p>
          <Link
            to={RoutesService.orders()}
            className="mt-4 inline-flex items-center text-red-700 font-medium underline"
          >
            Return to Orders
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              to={RoutesService.orders()}
              className="text-primary-600 font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Orders
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{order.title}</h1>
          </div>
          <div className="text-2xl font-bold text-green-700">
            {formatPrice(order.price)}
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
                  <p className="text-gray-700 whitespace-pre-line">{order.description}</p>
                </div>
                
                {order.orderReference && (
                  <div className="mb-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Reference</h2>
                    <p className="text-gray-700">{order.orderReference}</p>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Details</h2>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(order.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(order.updatedAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">User ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.userId}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default OrderDetailPage; 