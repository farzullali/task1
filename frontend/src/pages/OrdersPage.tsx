import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useOrders } from '../hooks/useOrders';
import { Order } from '../types/order';
import { RoutesService } from '../services/routes.service';

const OrdersPage: React.FC = () => {
  const { orders, isLoadingOrders, refetchOrders, error: hookError } = useOrders();
  const [error, setError] = useState<string | null>(null);

  // Handle hook errors
  useEffect(() => {
    if (hookError) {
      setError(hookError);
    }
  }, [hookError]);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }, []);

  const sortedOrders = useMemo(() => {
    if (!orders) return [];
    
    return [...orders].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [orders]);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <Link
          to={RoutesService.createOrder()}
          className="btn-primary flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create New Order
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <p>{error}</p>
          <button
            onClick={() => {
              setError(null);
              refetchOrders();
            }}
            className="text-red-700 font-medium underline mt-1"
          >
            Try again
          </button>
        </div>
      )}

      {isLoadingOrders ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <>
          {!sortedOrders.length ? (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-xl font-medium text-gray-900">No orders yet</h3>
              <p className="mt-1 text-gray-500">Get started by creating a new order.</p>
              <div className="mt-6">
                <Link
                  to={RoutesService.createOrder()}
                  className="btn-primary inline-flex items-center"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create New Order
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {sortedOrders.map((order, index) => (
                  <motion.li
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link to={RoutesService.orderDetail(order.id)} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-lg font-medium text-primary-600 truncate">
                              {order.title}
                            </p>
                            {order.orderReference && (
                              <p className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100">
                                Ref: {order.orderReference}
                              </p>
                            )}
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-md leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {formatPrice(order.price)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500 line-clamp-1">
                              {order.description.length > 100
                                ? `${order.description.substring(0, 100)}...`
                                : order.description}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <p>Created on {formatDate(order.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default OrdersPage; 