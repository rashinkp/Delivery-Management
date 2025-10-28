// src/pages/admin/ProductManagement.tsx
"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import Alert from "@/components/ui/alert";
import { DataTable } from "@/components/Table";
import { ProductForm } from "@/components/product/ProductForm";
import { productColumns } from "@/components/product/Columns";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/useProducts";
import type { CreateProductDto, Product, UpdateProductDto } from "@/types/product";

export default function ProductManagement() {
  // Dialog state
  const [openForm, setOpenForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  
  // Filter & pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">('desc');
  
  // Error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch products with server-side pagination, search, and filters
  const { data: productsResp, isLoading, error } = useProducts({
    page: pageIndex + 1,
    limit: pageSize,
    search: searchTerm || undefined,
    category: categoryFilter || undefined,
    sortBy,
    sortOrder,
  });
  const products = productsResp?.data ?? [];
  const total = productsResp?.total ?? 0;
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  // Helper function to extract error message
  const extractErrorMessage = (error: any): string => {
    if (error?.message) {
      return error.message;
    }
    if (error?.response?.data?.error) {
      return error.response.data.error;
    }
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.response?.message) {
      return error.response.message;
    }
    return "An unexpected error occurred. Please try again.";
  };

  // CRUD handlers
  const handleCreate = async (data: CreateProductDto | UpdateProductDto) => {
    try {
      setErrorMessage(null);
      await createMutation.mutateAsync(data as CreateProductDto);
      setOpenForm(false);
    } catch (error) {
      console.error("Create product error:", error);
      const message = extractErrorMessage(error);
      setErrorMessage(message);
    }
  };
const handleUpdate = async (data: UpdateProductDto) => {
  if (!editingProduct) return;

  if (!editingProduct.productId) {
    console.error("No ID found for editing product:", editingProduct);
    return;
  }

  try {
    setErrorMessage(null);

    // ✅ Remove fields not needed by backend
    const cleanedData: UpdateProductDto = {
      name: data.name,
      price: data.price,
      category: data.category,
      image: data.image,
      stock: data.stock,
    };

    await updateMutation.mutateAsync({
      id: editingProduct.productId,
      data: cleanedData,
    });
    setOpenForm(false);
    setEditingProduct(undefined);
  } catch (error) {
    console.error("Update product error:", error);
    const message = extractErrorMessage(error);
    setErrorMessage(message);
  }
};


  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Delete product error:", error);
    }
  };

  const handleView = (product: Product) => {
    console.log("View product:", product);
  };

  // Dialog handlers
  const openCreate = () => {
    setErrorMessage(null);
    setEditingProduct(undefined);
    setOpenForm(true);
  };

  const openEdit = (product: Product) => {
    setErrorMessage(null);
    setEditingProduct(product);
    setOpenForm(true);
  };

  const closeForm = () => {
    setErrorMessage(null);
    setOpenForm(false);
    setEditingProduct(undefined);
  };

  // Search handler - reset to page 1 when searching
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPageIndex(0);
  }, []);

  // Category filter handler - reset to page 1 when filtering
  const handleCategoryFilter = useCallback((value: string) => {
    setCategoryFilter(value);
    setPageIndex(0);
  }, []);

  // Get unique categories from current page
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Get error message
  const getErrorMessage = () => {
    if (errorMessage) {
      return errorMessage;
    }
    if (error) {
      return "Failed to load products. Please try again.";
    }
    if (createMutation.error) {
      return "Failed to create product. Please try again.";
    }
    if (updateMutation.error) {
      return "Failed to update product. Please try again.";
    }
    if (deleteMutation.error) {
      return "Failed to delete product. Please try again.";
    }
    return null;
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your product inventory
          </p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Error Alert */}
      {getErrorMessage() && (
        <Alert type="error" message={getErrorMessage()!} />
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 flex-1 min-w-[300px]">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search products by name, category, or ID..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={products}
        columns={productColumns(openEdit, handleDelete, handleView)}
        pagination={{ pageIndex, pageSize }}
        totalCount={total}
        isLoading={isLoading}
        onPaginationChange={(state) => {
          setPageIndex(state.pageIndex);
          setPageSize(state.pageSize);
        }}
        onSortChange={(sorting) => {
          const first = Array.isArray(sorting) && sorting.length ? sorting[0] : undefined;
          if (first) {
            setSortBy(first.id);
            setSortOrder(first.desc ? "desc" : "asc");
          } else {
            setSortBy('createdAt');
            setSortOrder('desc');
          }
        }}
      />

      {/* Form Dialog */}
      <Dialog open={openForm} onOpenChange={closeForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          {errorMessage && (
            <Alert type="error" message={errorMessage} />
          )}
          <ProductForm
            initialValues={editingProduct}
            onSubmit={editingProduct ? handleUpdate : handleCreate}
            onClose={closeForm}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

