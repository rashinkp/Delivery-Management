import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { CreateOrderDto, Order, UpdateOrderDto } from "@/types/order";

// Fetch all orders
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<Order[]> => {
      const response = await axiosInstance.get('/orders');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch orders for current driver
export const useDriverOrders = (driverId: string | undefined) => {
  return useQuery({
    queryKey: ['orders', 'driver', driverId],
    queryFn: async (): Promise<Order[]> => {
      const response = await axiosInstance.get(`/orders/driver/${driverId}`);
      return response.data.data;
    },
    enabled: !!driverId,
    staleTime: 1000 * 60 * 5,
  });
};

// Fetch single order
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async (): Promise<Order> => {
      const response = await axiosInstance.get(`/orders/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Create order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrderDto): Promise<Order> => {
      const response = await axiosInstance.post('/orders', data);
      if (response.data && !response.data.success) {
        throw new Error(response.data.error || response.data.message || 'Failed to create order');
      }
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Update order
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOrderDto }): Promise<Order> => {
      const response = await axiosInstance.patch(`/orders/${id}`, data);
      if (response.data && !response.data.success) {
        throw new Error(response.data.error || response.data.message || 'Failed to update order');
      }
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
    onError: (error) => {
      console.error('Error updating order:', error);
    },
  });
};

// Delete order
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await axiosInstance.delete(`/orders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

