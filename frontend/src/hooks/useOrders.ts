import { useCallback, useState, useEffect } from 'react';
import { 
  useQuery, 
  useMutation, 
  useQueryClient
} from '@tanstack/react-query';
import { getOrders, getOrderById, createOrder } from '../services/order.service';
import { Order, CreateOrderRequest } from '../types/order';
import { useAuth } from '../contexts/AuthContext';

// Custom hook for fetching a single order
export const useOrder = (id: string) => {
  const [error, setError] = useState<string | null>(null);
  
  const result = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
  });
  
  return {
    ...result,
    error
  };
};

export const useOrders = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Get all orders
  const { 
    data: orders, 
    isLoading: isLoadingOrders,
    refetch: refetchOrders
  } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: getOrders,
    enabled: !!user, // Only run query if user is authenticated
  });

  // Effect to clear orders cache when user changes
  useEffect(() => {
    return () => {
      // This cleanup function will run when the component unmounts or user changes
      queryClient.removeQueries({ queryKey: ['orders'] });
    };
  }, [user?.id, queryClient]);

  // Create new order
  const createOrderMutation = useMutation({
    mutationFn: (orderData: CreateOrderRequest) => createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', user?.id] });
    },
  });

  const createNewOrder = useCallback(async (orderData: CreateOrderRequest) => {
    try {
      setError(null);
      return await createOrderMutation.mutateAsync(orderData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      throw error;
    }
  }, [createOrderMutation]);

  return {
    orders,
    isLoadingOrders,
    createNewOrder,
    isCreating: createOrderMutation.isPending,
    error,
    clearError: () => setError(null),
    refetchOrders
  };
}; 