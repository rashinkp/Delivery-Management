// src/pages/admin/DriverManagement.tsx
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
import { DriverForm } from "@/components/driver/DriverForm";
import { driverColumns } from "@/components/driver/Columns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  useTruckDrivers,
  useCreateTruckDriver,
  useUpdateTruckDriver,
  useDeleteTruckDriver,
  useRestoreTruckDriver,
} from "@/hooks/useTruckDrivers";
import type { CreateTruckDriverDto, TruckDriver, UpdateTruckDriverDto } from "@/types/truckDriver";

export default function DriverManagement() {
  // State management
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [deletedFilter, setDeletedFilter] = useState<'all' | 'active' | 'deleted'>('all');
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);

  // Dialog state
  const [openForm, setOpenForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<TruckDriver | undefined>(undefined);
  
  // Error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // AlertDialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [targetName, setTargetName] = useState<string | null>(null);

  // API hooks with server-side pagination and filtering
  const { data: driversResponse, isLoading, error } = useTruckDrivers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: searchTerm || undefined,
    status: statusFilter || undefined,
    sortBy: sorting.length > 0 ? sorting[0].id : 'createdAt',
    sortOrder: sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : 'desc',
    deleted: deletedFilter,
  });

  const createMutation = useCreateTruckDriver();
  const updateMutation = useUpdateTruckDriver();
  const deleteMutation = useDeleteTruckDriver();
  const restoreMutation = useRestoreTruckDriver();

  // Helper function to extract error message
  const extractErrorMessage = (error: any): string => {
    // Check for direct error message (already extracted in mutation)
    if (error?.message) {
      return error.message;
    }
    // Check for ApiResponseDto format (used by backend)
    if (error?.response?.data?.error) {
      return error.response.data.error;
    }
    // Check for nested error message
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    // Check for direct error message
    if (error?.response?.message) {
      return error.response.message;
    }
    return "An unexpected error occurred. Please try again.";
  };

  // CRUD handlers
  const handleCreate = async (data: CreateTruckDriverDto | UpdateTruckDriverDto) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      await createMutation.mutateAsync(data as CreateTruckDriverDto);
      setOpenForm(false);
      setSuccessMessage("Driver created successfully.");
    } catch (error) {
      console.error("Create driver error:", error);
      const message = extractErrorMessage(error);
      setErrorMessage(message);
    }
  };

  const handleUpdate = async (data: UpdateTruckDriverDto) => {
    if (!editingDriver) return;
    
    // Safety check for ID
    if (!editingDriver.driverId) {
      console.error('No ID found for editing driver:', editingDriver);
      return;
    }
    
    try {
      setErrorMessage(null);
      
      // Filter out fields that shouldn't be sent to backend
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { driverId, createdAt, updatedAt, ...allowedFields } = data as any;
      
      // Remove password if it's empty (for updates, password is optional)
      const updateData = { ...allowedFields };
      if (!updateData.password || updateData.password.trim() === '') {
        delete updateData.password;
      }
      
      setSuccessMessage(null);
      await updateMutation.mutateAsync({ id: editingDriver.driverId, data: updateData });
      setOpenForm(false);
      setEditingDriver(undefined);
      setSuccessMessage("Driver updated successfully.");
    } catch (error) {
      console.error("Update driver error:", error);
      const message = extractErrorMessage(error);
      setErrorMessage(message);
    }
  };

  const confirmDelete = (id: string, name?: string) => {
    setTargetId(id);
    setTargetName(name || null);
    setDeleteDialogOpen(true);
  };

  const confirmRestore = (id: string, name?: string) => {
    setTargetId(id);
    setTargetName(name || null);
    setRestoreDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!targetId) return;
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      await deleteMutation.mutateAsync(targetId);
      setSuccessMessage("Driver deleted successfully.");
    } catch (error) {
      console.error("Delete driver error:", error);
      const message = extractErrorMessage(error);
      setErrorMessage(message);
    } finally {
      setDeleteDialogOpen(false);
      setTargetId(null);
      setTargetName(null);
    }
  };

  const handleRestoreConfirmed = async () => {
    if (!targetId) return;
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      await restoreMutation.mutateAsync(targetId);
      setSuccessMessage("Driver restored successfully.");
    } catch (error) {
      console.error("Restore driver error:", error);
      const message = extractErrorMessage(error);
      setErrorMessage(message);
    } finally {
      setRestoreDialogOpen(false);
      setTargetId(null);
      setTargetName(null);
    }
  };

  const handleView = (driver: TruckDriver) => {
    // You can implement a view modal or navigate to a detail page
    console.log("View driver:", driver);
  };

  // Dialog handlers
  const openCreate = () => {
    setErrorMessage(null);
    setEditingDriver(undefined);
    setOpenForm(true);
  };

  const openEdit = (driver: TruckDriver) => {
    setErrorMessage(null);
    setEditingDriver(driver);
    setOpenForm(true);
  };

  const closeForm = () => {
    setErrorMessage(null);
    setOpenForm(false);
    setEditingDriver(undefined);
  };

  // Search handler
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPagination({ ...pagination, pageIndex: 0 }); // Reset to first page
  }, [pagination]);

  // Status filter handler
  const handleStatusFilter = useCallback((value: string) => {
    setStatusFilter(value);
    setPagination({ ...pagination, pageIndex: 0 }); // Reset to first page
  }, [pagination]);

  // Get error message
  const getErrorMessage = () => {
    if (errorMessage) {
      return errorMessage;
    }
    if (error) {
      return "Failed to load drivers. Please try again.";
    }
    if (createMutation.error) {
      return "Failed to create driver. Please try again.";
    }
    if (updateMutation.error) {
      return "Failed to update driver. Please try again.";
    }
    if (deleteMutation.error) {
      return "Failed to delete driver. Please try again.";
    }
    return null;
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Truck Driver Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your truck drivers and their information
          </p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Driver
        </Button>
      </div>

      {/* Alerts */}
      {getErrorMessage() && (
        <Alert type="error" message={getErrorMessage()!} />
      )}
      {successMessage && <Alert type="success" message={successMessage} />}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 flex-1 min-w-[300px]">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search drivers by name, mobile, or license..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={deletedFilter}
            onChange={(e) => { setDeletedFilter(e.target.value as any); setPagination({ ...pagination, pageIndex: 0 }); }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={driversResponse?.data || []}
        columns={driverColumns(
          openEdit,
          (id: string) => {
            const d = (driversResponse?.data || []).find(x => x.driverId === id);
            confirmDelete(id, d?.name);
          },
          handleView,
          (id: string) => {
            const d = (driversResponse?.data || []).find(x => x.driverId === id);
            confirmRestore(id, d?.name);
          }
        )}
        pagination={pagination}
        totalCount={driversResponse?.total || 0}
        isLoading={isLoading}
        onPaginationChange={setPagination}
        onSortChange={setSorting}
      />

      {/* Form Dialog */}
      <Dialog open={openForm} onOpenChange={closeForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingDriver ? "Edit Driver" : "Add New Driver"}
            </DialogTitle>
          </DialogHeader>
          {errorMessage && (
            <Alert type="error" message={errorMessage} />
          )}
          <DriverForm
            initialValues={editingDriver}
            onSubmit={editingDriver ? handleUpdate : handleCreate}
            onClose={closeForm}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete AlertDialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete driver</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{targetName || "this driver"}</span>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirmed}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore AlertDialog */}
      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore driver</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore{" "}
              <span className="font-semibold">{targetName || "this driver"}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestoreConfirmed}>
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}