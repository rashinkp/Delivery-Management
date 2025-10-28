import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { CreateVendorDto, Vendor, UpdateVendorDto } from "@/types/vendor";

export interface VendorsResponse {
  data: Vendor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Fetch vendors with pagination
export const useVendors = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['vendors', params],
    queryFn: async (): Promise<VendorsResponse> => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.search) searchParams.append('search', params.search);
      if (params?.location) searchParams.append('location', params.location);
      if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
      const qs = searchParams.toString();
      const response = await axiosInstance.get(`/vendors${qs ? `?${qs}` : ''}`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Fetch vendors by location
export const useVendorsByLocation = (location: string) => {
  return useQuery({
    queryKey: ['vendors', 'location', location],
    queryFn: async (): Promise<Vendor[]> => {
      const response = await axiosInstance.get(`/vendors/location/${location}`);
      return response.data.data;
    },
    enabled: !!location,
    staleTime: 1000 * 60 * 5,
  });
};

// Fetch single vendor
export const useVendor = (id: string) => {
  return useQuery({
    queryKey: ['vendor', id],
    queryFn: async (): Promise<Vendor> => {
      const response = await axiosInstance.get(`/vendors/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Create vendor
export const useCreateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVendorDto): Promise<Vendor> => {
      const response = await axiosInstance.post('/vendors', data);
      if (response.data && !response.data.success) {
        throw new Error(response.data.error || response.data.message || 'Failed to create vendor');
      }
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
};

// Update vendor
export const useUpdateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateVendorDto }): Promise<Vendor> => {
      const response = await axiosInstance.patch(`/vendors/${id}`, data);
      if (response.data && !response.data.success) {
        throw new Error(response.data.error || response.data.message || 'Failed to update vendor');
      }
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendor', id] });
    },
  });
};

// Delete vendor
export const useDeleteVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await axiosInstance.delete(`/vendors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
};

