// src/components/vendor/Columns.tsx
import type { TableColumn } from "@/types/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye, RotateCcw } from "lucide-react";
import type { Vendor } from "@/types/vendor";

type VendorActionsProps = {
  vendor: Vendor;
  onEdit: (vendor: Vendor) => void;
  onDelete: (id: string) => void;
  onView?: (vendor: Vendor) => void;
  onRestore?: (id: string) => void;
};

export const VendorActions = ({ vendor, onEdit, onDelete, onView, onRestore }: VendorActionsProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {onView && (
        <DropdownMenuItem onClick={() => onView(vendor)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
      )}
      {!vendor.isDeleted && (
        <DropdownMenuItem onClick={() => onEdit(vendor)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
      )}
      {!vendor.isDeleted && (
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => onDelete(vendor.vendorId)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      )}
      {vendor.isDeleted && onRestore && (
        <DropdownMenuItem
          className="text-green-700"
          onClick={() => onRestore(vendor.vendorId)}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Recover
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);

// eslint-disable-next-line react-refresh/only-export-components
export const vendorColumns = (
  onEdit: (vendor: Vendor) => void,
  onDelete: (id: string) => void,
  onView?: (vendor: Vendor) => void,
  onRestore?: (id: string) => void
): TableColumn<Vendor>[] => [
  {
    accessorKey: "name",
    header: "Vendor Name",
    meta: { sortable: true, filterable: true },
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    meta: { sortable: true, filterable: true },
    cell: ({ row }) => (
      <div>
        {row.original.location}
      </div>
    ),
  },
  {
    accessorKey: "contactNumber",
    header: "Contact",
    meta: { sortable: true },
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        {row.original.contactNumber}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: { sortable: true },
    cell: ({ row }) => (
      <div className="text-sm text-gray-600 truncate max-w-[150px]" title={row.original.email}>
        {row.original.email}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-sm" title={row.original.address}>
        {row.original.address}
      </div>
    ),
  },
  {
    accessorKey: "isDeleted",
    header: "Deleted",
    meta: { sortable: true, filterable: true },
    cell: ({ row }) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        row.original.isDeleted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
      }`}>
        {row.original.isDeleted ? 'Yes' : 'No'}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <VendorActions
        vendor={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
        onRestore={onRestore}
      />
    ),
  },
];

