// src/components/vendor/Columns.tsx
import type { TableColumn } from "@/types/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import type { Vendor } from "@/types/vendor";

type VendorActionsProps = {
  vendor: Vendor;
  onEdit: (vendor: Vendor) => void;
  onDelete: (id: string) => void;
  onView?: (vendor: Vendor) => void;
};

const VendorActions = ({ vendor, onEdit, onDelete, onView }: VendorActionsProps) => (
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
      <DropdownMenuItem onClick={() => onEdit(vendor)}>
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem
        className="text-red-600"
        onClick={() => onDelete(vendor.vendorId)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const vendorColumns = (
  onEdit: (vendor: Vendor) => void,
  onDelete: (id: string) => void,
  onView?: (vendor: Vendor) => void
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <VendorActions
        vendor={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    ),
  },
];

