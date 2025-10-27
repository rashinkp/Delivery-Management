import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { CreateTruckDriverDto, TruckDriver, UpdateTruckDriverDto } from "@/types/truckDriver";


export interface TruckDriversResponse {
  data: TruckDriver[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Fetch truck drivers with pagination and filtering
export const useTruckDrivers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['truck-drivers', params],
    queryFn: async (): Promise<TruckDriversResponse> => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.search) searchParams.append('search', params.search);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

      const response = await axiosInstance.get(`/truck-drivers?${searchParams}`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch truck drivers by status
export const useTruckDriversByStatus = (status: string) => {
  return useQuery({
    queryKey: ['truck-drivers', 'status', status],
    queryFn: async (): Promise<TruckDriver[]> => {
      const response = await axiosInstance.get(`/truck-drivers/status/${status}`);
      return response.data.data;
    },
    enabled: !!status,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch single truck driver
export const useTruckDriver = (id: string) => {
  return useQuery({
    queryKey: ['truck-driver', id],
    queryFn: async (): Promise<TruckDriver> => {
      const response = await axiosInstance.get(`/truck-drivers/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Create truck driver
export const useCreateTruckDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTruckDriverDto): Promise<TruckDriver> => {
      const response = await axiosInstance.post('/truck-drivers', data);
      // Check if response contains an error (backend uses ApiResponseDto format)
      if (response.data && !response.data.success) {
        throw new Error(response.data.error || response.data.message || 'Failed to create truck driver');
      }
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['truck-drivers'] });
    },
  });
};

// Update truck driver
export const useUpdateTruckDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTruckDriverDto }): Promise<TruckDriver> => {
      const response = await axiosInstance.patch(`/truck-drivers/${id}`, data);
      // Check if response contains an error (backend uses ApiResponseDto format)
      if (response.data && !response.data.success) {
        throw new Error(response.data.error || response.data.message || 'Failed to update truck driver');
      }
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['truck-drivers'] });
      queryClient.invalidateQueries({ queryKey: ['truck-driver', id] });
    },
  });
};

// Delete truck driver
export const useDeleteTruckDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await axiosInstance.delete(`/truck-drivers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['truck-drivers'] });
    },
  });
};
