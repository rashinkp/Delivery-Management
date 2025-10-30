// src/pages/driver/Orders.tsx
"use client";

import { useMemo, useState } from "react";
import { useDriverOrders, useDeliverOrder } from "@/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";
import { DataTable } from "@/components/Table";
import type { TableColumn } from "@/types/table";
import type { Order } from "@/types/order";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DriverOrders() {
  const { user } = useAuth();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { data: ordersResp, isLoading } = useDriverOrders(user?._id, { page: pageIndex + 1, limit: pageSize });
  const [search, setSearch] = useState("");
  const deliverMutation = useDeliverOrder();

  const filtered = useMemo(() => {
    const orders = ordersResp?.data ?? [];
    if (!search) return orders;
    const q = search.toLowerCase();
    return orders.filter(
      (o) =>
        o.orderNumber?.toLowerCase().includes(q) ||
        o.vendor?.name?.toLowerCase().includes(q)
    );
  }, [ordersResp?.data, search]);

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
      accessorKey: "vendor",
      header: "Vendor",
      cell: ({ row }) => <span>{row.original.vendor?.name}</span>,
    },
    {
      accessorKey: "totalAmount",
      header: "Total",
      cell: ({ row }) => <span>${row.original.totalAmount.toFixed(2)}</span>,
    },
    {
      accessorKey: "collectedAmount",
      header: "Collected",
      cell: ({ row }) => (
        <span>${(row.original.collectedAmount ?? 0).toFixed(2)}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
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
      cell: ({ row }) => (
        <span>{new Date(row.original.createdAt || "").toLocaleString()}</span>
      ),
    },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const order = row.original;
      const isDelivered = order.status === "delivered";
      return (
        <div className="flex gap-2">
          {!isDelivered && (
            <Button
              size="sm"
              variant="default"
              onClick={async () => {
                try {
                  await deliverMutation.mutateAsync(order.orderId);
                } catch (e) {
                  console.error("Failed to deliver order", e);
                }
              }}
            >
              Mark Delivered
            </Button>
          )}
        </div>
      );
    },
  },
  ];

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-2">Orders you have created</p>
      </div>

      <div className="flex items-center gap-3">
        <Input
          placeholder="Search by order # or vendor"
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
    </div>
  );
}
