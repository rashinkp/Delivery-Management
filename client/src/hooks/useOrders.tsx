import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { CreateOrderDto, Order, UpdateOrderDto } from "@/types/order";

export interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Fetch all orders with pagination
export const useOrders = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async (): Promise<OrdersResponse> => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.search) searchParams.append('search', params.search);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
      const qs = searchParams.toString();
      const response = await axiosInstance.get(`/orders${qs ? `?${qs}` : ''}`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch orders for current driver
export const useDriverOrders = (
  driverId: string | undefined,
  params?: { page?: number; limit?: number; search?: string; status?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }
) => {
  return useQuery({
    queryKey: ['orders', 'driver', driverId, params],
    queryFn: async (): Promise<OrdersResponse> => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.search) searchParams.append('search', params.search);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
      const qs = searchParams.toString();
      const response = await axiosInstance.get(`/orders/driver/${driverId}${qs ? `?${qs}` : ''}`);
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

// Driver: update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'pending' | 'delivered' }): Promise<Order> => {
      const response = await axiosInstance.patch(`/orders/${id}/status`, { status });
      if (response.data && !response.data.success) {
        throw new Error(response.data.error || response.data.message || 'Failed to update order status');
      }
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
    onError: (error) => {
      console.error('Error updating order status:', error);
    },
  });
};

// Driver: mark order delivered
export const useDeliverOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<Order> => {
      const response = await axiosInstance.patch(`/orders/${id}/deliver`);
      if (response.data && !response.data.success) {
        throw new Error(response.data.error || response.data.message || 'Failed to deliver order');
      }
      return response.data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
    onError: (error) => {
      console.error('Error delivering order:', error);
    },
  });
};

