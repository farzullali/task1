import { orderApi } from './api';
import { Order, CreateOrderRequest } from '../types/order';

export const getOrders = async (): Promise<Order[]> => {
  const response = await orderApi.get<Order[]>('/orders');
  return response.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const response = await orderApi.get<Order>(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (orderData: CreateOrderRequest): Promise<Order> => {
  const response = await orderApi.post<Order>('/orders', orderData);
  return response.data;
}; 