import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { CreateOrderRequest } from '../../types/order';
import { useOrders } from '../../hooks/useOrders';
import { RoutesService } from '../../services/routes.service';

// Define our form data interface explicitly to match CreateOrderRequest
interface OrderFormData {
  title: string;
  description: string;
  price: number;
  orderReference: string;
}

const CreateOrderForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { createNewOrder } = useOrders();

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<OrderFormData>({
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      orderReference: '',
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Convert form data to the request type
      const orderData: CreateOrderRequest = {
        title: data.title,
        description: data.description,
        price: data.price,
        orderReference: data.orderReference || null,
      };
      
      const newOrder = await createNewOrder(orderData);
      setSuccess(true);
      reset();
      
      // Navigate to the newly created order after a brief success message
      setTimeout(() => {
        navigate(RoutesService.orderDetail(newOrder.id));
      }, 1500);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred while creating the order.');
      }
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create a New Order</h1>
      </div>
      
      {error && (
        <div className="p-3 text-sm font-medium text-white bg-red-500 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-sm font-medium text-white bg-green-500 rounded-md">
          Order created successfully!
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <div className="mt-1">
              <input
                id="title"
                type="text"
                className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                rows={4}
                className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="price"
                type="number"
                step="0.01"
                className={`input-field pl-7 ${errors.price ? 'border-red-500' : ''}`}
                placeholder="0.00"
                {...register('price', { 
                  required: 'Price is required',
                  valueAsNumber: true, 
                  min: { value: 0.01, message: 'Price must be positive' } 
                })}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="orderReference" className="block text-sm font-medium text-gray-700">
              Order Reference (Optional)
            </label>
            <div className="mt-1">
              <input
                id="orderReference"
                type="text"
                className={`input-field ${errors.orderReference ? 'border-red-500' : ''}`}
                {...register('orderReference')}
              />
              {errors.orderReference && (
                <p className="mt-1 text-sm text-red-600">{errors.orderReference.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            className="btn-secondary flex-1"
            onClick={() => navigate(RoutesService.orders())}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex-1 flex justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Create Order'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrderForm; 