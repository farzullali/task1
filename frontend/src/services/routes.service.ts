import { generatePath } from 'react-router-dom';

/**
 * Routes configuration for the application
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  CREATE_ORDER: '/orders/new',
  ERROR: '/error',
};

/**
 * Routes service to handle routing logic
 */
export const RoutesService = {
  /**
   * Get home page path
   */
  home: (): string => ROUTES.HOME,

  /**
   * Get login page path
   */
  login: (): string => ROUTES.LOGIN,

  /**
   * Get register page path
   */
  register: (): string => ROUTES.REGISTER,

  /**
   * Get orders list page path
   */
  orders: (): string => ROUTES.ORDERS,

  /**
   * Get order detail page path with ID parameter
   * @param id Order ID
   */
  orderDetail: (id: string): string => 
    generatePath(ROUTES.ORDER_DETAIL, { id }),

  /**
   * Get create order page path
   */
  createOrder: (): string => ROUTES.CREATE_ORDER,

  /**
   * Get error page path
   * @param code Error code (optional)
   * @param message Error message (optional)
   */
  error: (code?: number, message?: string): string => ROUTES.ERROR,

  /**
   * Check if the current path is a protected route
   * @param path Current path
   */
  isProtectedRoute: (path: string): boolean => {
    return path.startsWith('/orders');
  },
}; 