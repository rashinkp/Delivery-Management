// src/types/table.ts
export type ColumnMeta = {
  sortable?: boolean;
  filterable?: boolean;
};

export type TableColumn<T> = {
  accessorKey?: keyof T;
  id?: string;
  header: string | ((props: { column: any }) => React.ReactNode);
  cell?: (props: { row: { original: T } }) => React.ReactNode;
  meta?: ColumnMeta;
};

export type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export type TableProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  pagination?: PaginationState;
  totalCount?: number;
  isLoading?: boolean;
  onPaginationChange?: (state: PaginationState) => void;
  onSortChange?: (sort: { id: string; desc: boolean }[]) => void;
  onFilterChange?: (filters: { id: string; value: string }[]) => void;
  /** Optional row actions (edit / delete) – you can pass your own component */
  rowActions?: (row: T) => React.ReactNode;
};
