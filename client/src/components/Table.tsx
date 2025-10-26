"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { TableProps, PaginationState } from "@/types/table";

export function DataTable<T>({
  data,
  columns,
  pagination,
  totalCount = 0,
  isLoading = false,
  onPaginationChange,
  onSortChange,
  onFilterChange,
  rowActions,
}: TableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pageIndex, setPageIndex] = React.useState(pagination?.pageIndex ?? 0);
  const [pageSize, setPageSize] = React.useState(pagination?.pageSize ?? 10);

  const tanstackColumns: ColumnDef<T>[] = React.useMemo(
    () =>
      columns.map((col) => {
        const header =
          typeof col.header === "function"
            ? col.header
            : ({ column }: { column: Column<T> }) => {
                const sortable = col.meta?.sortable;
                return sortable ? (
                  <Button
                    variant="ghost"
                    onClick={() =>
                      column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="h-auto p-0 font-medium"
                  >
                    {String(col.header)}
                    {column.getIsSorted() === "asc"
                      ? " up"
                      : column.getIsSorted() === "desc"
                      ? " down"
                      : ""}
                  </Button>
                ) : (
                  col.header
                );
              };

        return {
          accessorKey: col.accessorKey as string,
          id: col.id,
          header,
          cell: col.cell
            ? col.cell
            : ({ row }) => {
                const value = row.getValue(
                  col.id ?? (col.accessorKey as string)
                );
                return (
                  <div className="truncate max-w-[200px]">{String(value) ?? "-"}</div>
                );
              },
          meta: col.meta,
        } as ColumnDef<T>;
      }),
    [columns]
  );

  const table = useReactTable({
    data,
    columns: tanstackColumns,
    pageCount: totalCount ? Math.ceil(totalCount / pageSize) : -1,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: (updater) => {
      const newSort =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSort);
      onSortChange?.(newSort);
    },
    state: {
      sorting,
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater(table.getState().pagination)
          : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
      onPaginationChange?.(newState);
    },
  });

  return (
    <div className="space-y-4">

      {/* ==== Table ==== */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (rowActions ? 1 : 0)}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  {rowActions && (
                    <TableCell className="text-right">
                      {rowActions(row.original)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (rowActions ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ==== Pagination ==== */}
      {totalCount > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {pageIndex * pageSize + 1} to{" "}
            {Math.min((pageIndex + 1) * pageSize, totalCount)} of {totalCount}{" "}
            results
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
