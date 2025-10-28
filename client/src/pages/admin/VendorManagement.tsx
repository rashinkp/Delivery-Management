// src/pages/admin/VendorManagement.tsx
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
import { VendorForm } from "@/components/vendor/VendorForm";
import { vendorColumns } from "@/components/vendor/Columns";
import {
  useVendors,
  useCreateVendor,
  useUpdateVendor,
  useDeleteVendor,
} from "@/hooks/useVendors";
import type { CreateVendorDto, Vendor, UpdateVendorDto } from "@/types/vendor";

export default function VendorManagement() {
  // Dialog state
  const [openForm, setOpenForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | undefined>(undefined);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  
  // Error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch vendors
  const { data: vendorsResp, isLoading, error } = useVendors({ page: 1, limit: 200 });
  const vendors = vendorsResp?.data ?? [];

  const createMutation = useCreateVendor();
  const updateMutation = useUpdateVendor();
  const deleteMutation = useDeleteVendor();

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
  const handleCreate = async (data: CreateVendorDto | UpdateVendorDto) => {
    try {
      setErrorMessage(null);
      await createMutation.mutateAsync(data as CreateVendorDto);
      setOpenForm(false);
    } catch (error) {
      console.error("Create vendor error:", error);
      const message = extractErrorMessage(error);
      setErrorMessage(message);
    }
  };

  const handleUpdate = async (data: UpdateVendorDto) => {
    if (!editingVendor) return;
    
    if (!editingVendor.vendorId) {
      console.error('No ID found for editing vendor:', editingVendor);
      return;
    }
    
    try {
      setErrorMessage(null);
      await updateMutation.mutateAsync({ id: editingVendor.vendorId, data });
      setOpenForm(false);
      setEditingVendor(undefined);
    } catch (error) {
      console.error("Update vendor error:", error);
      const message = extractErrorMessage(error);
      setErrorMessage(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vendor? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Delete vendor error:", error);
    }
  };

  const handleView = (vendor: Vendor) => {
    console.log("View vendor:", vendor);
  };

  // Dialog handlers
  const openCreate = () => {
    setErrorMessage(null);
    setEditingVendor(undefined);
    setOpenForm(true);
  };

  const openEdit = (vendor: Vendor) => {
    setErrorMessage(null);
    setEditingVendor(vendor);
    setOpenForm(true);
  };

  const closeForm = () => {
    setErrorMessage(null);
    setOpenForm(false);
    setEditingVendor(undefined);
  };

  // Search handler
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Location filter handler
  const handleLocationFilter = useCallback((value: string) => {
    setLocationFilter(value);
  }, []);

  // Get all unique locations from vendors
  const locations = Array.from(new Set(vendors.map(v => v.location)));

  // Filter vendors based on search term and location
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = !searchTerm || 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactNumber.includes(searchTerm) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !locationFilter || vendor.location === locationFilter;
    
    return matchesSearch && matchesLocation;
  });

  // Get error message
  const getErrorMessage = () => {
    if (errorMessage) {
      return errorMessage;
    }
    if (error) {
      return "Failed to load vendors. Please try again.";
    }
    if (createMutation.error) {
      return "Failed to create vendor. Please try again.";
    }
    if (updateMutation.error) {
      return "Failed to update vendor. Please try again.";
    }
    if (deleteMutation.error) {
      return "Failed to delete vendor. Please try again.";
    }
    return null;
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your vendor profiles
          </p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Vendor
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
            placeholder="Search vendors by name, location, contact, or email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={locationFilter}
            onChange={(e) => handleLocationFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredVendors}
        columns={vendorColumns(openEdit, handleDelete, handleView)}
        pagination={{ pageIndex: 0, pageSize: 10 }}
        totalCount={filteredVendors.length}
        isLoading={isLoading}
        onPaginationChange={() => {}}
        onSortChange={() => {}}
      />

      {/* Form Dialog */}
      <Dialog open={openForm} onOpenChange={closeForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingVendor ? "Edit Vendor" : "Add New Vendor"}
            </DialogTitle>
          </DialogHeader>
          {errorMessage && (
            <Alert type="error" message={errorMessage} />
          )}
          <VendorForm
            initialValues={editingVendor}
            onSubmit={editingVendor ? handleUpdate : handleCreate}
            onClose={closeForm}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

