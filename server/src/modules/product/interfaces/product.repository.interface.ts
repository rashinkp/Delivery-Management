import { IBaseRepository } from "src/common/repositories/base.repository.interface";
import { Product } from "src/schemas/product.schema";


export interface IProductRepository extends IBaseRepository<Product> {
  findAll(): Promise<Product[]>;
  findByCategory(category: string): Promise<Product[]>;
  findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]>;
  findLowStock(threshold: number): Promise<Product[]>;
  findWithPagination(query: import('../dto/product-query.dto').ProductQueryDto): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }>;
}

