// src/pages/admin/OrderManagement.tsx
"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/Table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Eye } from "lucide-react";
import { useOrders, useDeleteOrder } from "@/hooks/useOrders";
import type { TableColumn } from "@/types/table";
import type { Order } from "@/types/order";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const OrderManagement = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { data: ordersResp, isLoading } = useOrders({ page: pageIndex + 1, limit: pageSize });
  const orders = ordersResp?.data ?? [];
  const [search, setSearch] = useState("");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [openView, setOpenView] = useState(false);
  const deleteMutation = useDeleteOrder();

  const handleView = (order: Order) => {
    setViewOrder(order);
    setOpenView(true);
  };

  const handleDelete = async (orderId: string) => {
    const ok = confirm("Delete this order? This action cannot be undone.");
    if (!ok) return;
    try {
      await deleteMutation.mutateAsync(orderId);
    } catch (e) {
      console.error("Failed to delete order", e);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return orders;
    const q = search.toLowerCase();
    return orders.filter(
      (o) =>
        o.orderNumber?.toLowerCase().includes(q) ||
        o.driver?.name?.toLowerCase().includes(q) ||
        o.vendor?.name?.toLowerCase().includes(q)
    );
  }, [orders, search]);

  const columns: TableColumn<Order>[] = [
    {
      accessorKey: "orderId",
      header: "Order ID",
      meta: { sortable: true },
      cell: ({ row }) => {
        const id = row.original.orderId;
        const shortId = id ? id.slice(-6).toUpperCase() : "N/A";
        return <span>{shortId}</span>;
      },
    },
    {
      accessorKey: "driver",
      header: "Driver",
      meta: { sortable: true },
      cell: ({ row }) => <span>{row.original.driver?.name}</span>,
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
      meta: { sortable: true },
      cell: ({ row }) => <span>{row.original.vendor?.name}</span>,
    },
    {
      accessorKey: "totalAmount",
      header: "Total",
      meta: { sortable: true },
      cell: ({ row }) => <span>${row.original.totalAmount.toFixed(2)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      meta: { sortable: true },
      cell: ({ row }) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${
            row.original.status === "delivered"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.original.status || "pending"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      meta: { sortable: true },
      cell: ({ row }) => (
        <span>{new Date(row.original.createdAt || "").toLocaleString()}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(row.original)}>
              <Eye className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => handleDelete(row.original.orderId)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-2">View all orders placed by drivers</p>
      </div>

      <div className="flex items-center gap-3">
        <Input
          placeholder="Search by order #, driver, vendor"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        pagination={{ pageIndex, pageSize }}
        totalCount={ordersResp?.total ?? filtered.length}
        isLoading={isLoading}
        onPaginationChange={({ pageIndex: pi, pageSize: ps }) => {
          setPageIndex(pi);
          setPageSize(ps);
        }}
        onSortChange={() => {}}
      />

      {/* View Order Dialog */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              Order Details{" "}
              {viewOrder?.orderNumber ? `#${viewOrder.orderNumber}` : ""}
            </DialogTitle>
          </DialogHeader>
          {viewOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border rounded">
                  <h4 className="font-semibold mb-1">Driver</h4>
                  <p className="text-sm text-gray-700">
                    {viewOrder.driver?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {viewOrder.driver?.mobile}
                  </p>
                </div>
                <div className="p-3 border rounded">
                  <h4 className="font-semibold mb-1">Vendor</h4>
                  <p className="text-sm text-gray-700">
                    {viewOrder.vendor?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {viewOrder.vendor?.location}
                  </p>
                </div>
              </div>

              <div className="border rounded">
                <div className="px-3 py-2 border-b font-semibold">Products</div>
                <div className="divide-y">
                  {viewOrder.products.map((p) => (
                    <div
                      key={p.productId}
                      className="px-3 py-2 flex items-center justify-between text-sm"
                    >
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-gray-500">
                          Qty: {p.quantity}
                        </div>
                      </div>
                      <div className="font-semibold">
                        ${(p.price * p.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-3 py-2 border-t flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">
                    ${viewOrder.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;
