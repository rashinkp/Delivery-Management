import { Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';

export interface BaseRepositoryInterface<T extends Document> {
  // Create operations
  create(data: Partial<T>): Promise<T>;
  createMany(data: Partial<T>[]): Promise<T[]>;

  // Read operations
  findById(id: string): Promise<T | null>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  findMany(filter: FilterQuery<T>, options?: QueryOptions): Promise<T[]>;
  findAll(options?: QueryOptions): Promise<T[]>;
  count(filter?: FilterQuery<T>): Promise<number>;
  exists(filter: FilterQuery<T>): Promise<boolean>;

  // Update operations
  updateById(id: string, data: UpdateQuery<T>): Promise<T | null>;
  updateOne(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null>;
  updateMany(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<number>;

  // Delete operations
  deleteById(id: string): Promise<boolean>;
  deleteOne(filter: FilterQuery<T>): Promise<boolean>;
  deleteMany(filter: FilterQuery<T>): Promise<number>;

  // Pagination
  findWithPagination(
    filter: FilterQuery<T>,
    page: number,
    limit: number,
    sort?: Record<string, 1 | -1>,
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;

  // Aggregation
  aggregate(pipeline: any[]): Promise<any[]>;
}
