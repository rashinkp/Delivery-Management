import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { CreateProductDto, Product, UpdateProductDto } from "@/types/product";

// Fetch all products
export const useProducts = (params?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async (): Promise<Product[]> => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.append('category', params.category);
      if (params?.minPrice) searchParams.append('minPrice', params.minPrice.toString());
      if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());

      const queryString = searchParams.toString();
      const response = await axiosInstance.get(`/products${queryString ? `?${queryString}` : ''}`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch products by category
export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: async (): Promise<Product[]> => {
      const response = await axiosInstance.get(`/products/category/${category}`);
      return response.data.data;
    },
    enabled: !!category,
    staleTime: 1000 * 60 * 5,
  });
};

// Fetch single product
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async (): Promise<Product> => {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductDto): Promise<Product> => {
      const response = await axiosInstance.post('/products', data);
      if (response.data && !response.data.success) {
        throw new Error(response.data.error || response.data.message || 'Failed to create product');
      }
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProductDto }): Promise<Product> => {
      const response = await axiosInstance.patch(`/products/${id}`, data);
      if (response.data && !response.data.success) {
        throw new Error(response.data.error || response.data.message || 'Failed to update product');
      }
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
  });
};

// Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await axiosInstance.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

