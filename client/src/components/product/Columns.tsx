// src/components/product/Columns.tsx
import type { TableColumn } from "@/types/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import type { Product } from "@/types/product";

type ProductActionsProps = {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onView?: (product: Product) => void;
};

const ProductActions = ({ product, onEdit, onDelete, onView }: ProductActionsProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {onView && (
        <DropdownMenuItem onClick={() => onView(product)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
      )}
      <DropdownMenuItem onClick={() => onEdit(product)}>
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem
        className="text-red-600"
        onClick={() => onDelete(product.productId)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const productColumns = (
  onEdit: (product: Product) => void,
  onDelete: (id: string) => void,
  onView?: (product: Product) => void
): TableColumn<Product>[] => [
  {
    accessorKey: "name",
    header: "Product Name",
    meta: { sortable: true, filterable: true },
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    meta: { sortable: true },
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        ${row.original.price.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    meta: { sortable: true, filterable: true },
    cell: ({ row }) => (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
        {row.original.category}
      </span>
    ),
  },
  {
    accessorKey: "stock",
    header: "Stock",
    meta: { sortable: true },
    cell: ({ row }) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        row.original.stock > 10 
          ? 'bg-green-100 text-green-800' 
          : row.original.stock > 0
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {row.original.stock}
      </span>
    ),
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="w-10 h-10 rounded overflow-hidden">
        <img 
          src={row.original.image} 
          alt={row.original.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50';
          }}
        />
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ProductActions
        product={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    ),
  },
];
