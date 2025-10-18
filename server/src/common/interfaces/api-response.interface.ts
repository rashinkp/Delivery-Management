export interface ApiResponse<T = any> {
  success: boolean;
  code: string;
  message: string;
  data?: T;
  errors?: string[];
  timestamp: string;
  path?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  code: string;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  timestamp: string;
  path?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ApiError {
  code: string;
  message: string;
  details?: string;
  field?: string;
}
