import { useCallback, useState } from 'react';
import { 
  useQuery, 
  useMutation, 
  useQueryClient
} from '@tanstack/react-query';
import { getOrders, getOrderById, createOrder } from '../services/order.service';
import { Order, CreateOrderRequest } from '../types/order';

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

  // Get all orders
  const { 
    data: orders, 
    isLoading: isLoadingOrders,
    refetch: refetchOrders
  } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });

  // Create new order
  const createOrderMutation = useMutation({
    mutationFn: (orderData: CreateOrderRequest) => createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
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