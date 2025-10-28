// src/components/driver/Columns.tsx
import type { TableColumn } from "@/types/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import type { TruckDriver } from "@/types/truckDriver";

type DriverActionsProps = {
  driver: TruckDriver;
  onEdit: (driver: TruckDriver) => void;
  onDelete: (id: string) => void;
  onView?: (driver: TruckDriver) => void;
};

export const DriverActions = ({ driver, onEdit, onDelete, onView }: DriverActionsProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {onView && (
        <DropdownMenuItem onClick={() => onView(driver)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
      )}
      <DropdownMenuItem onClick={() => onEdit(driver)}>
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem
        className="text-red-600"
        onClick={() => onDelete(driver.driverId)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// eslint-disable-next-line react-refresh/only-export-components
export const driverColumns = (
  onEdit: (driver: TruckDriver) => void,
  onDelete: (id: string) => void,
  onView?: (driver: TruckDriver) => void
): TableColumn<TruckDriver>[] => [
  {
    accessorKey: "name",
    header: "Name",
    meta: { sortable: true, filterable: true },
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
    meta: { sortable: true, filterable: true },
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        {row.original.mobile}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.original.address}>
        {row.original.address}
      </div>
    ),
  },
  {
    accessorKey: "licenseNumber",
    header: "License",
    meta: { sortable: true, filterable: true },
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        {row.original.licenseNumber}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: { sortable: true, filterable: true },
    cell: ({ row }) => {
      const status = row.original.status || 'active';
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DriverActions
        driver={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    ),
  },
];
