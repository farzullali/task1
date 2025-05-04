export interface Order {
  id: string;
  title: string;
  description: string;
  price: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  orderReference?: string;
}

export interface CreateOrderRequest {
  title: string;
  description: string;
  price: number;
  orderReference?: string | null;
} 