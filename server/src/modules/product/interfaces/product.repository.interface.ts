import { IBaseRepository } from "src/common/repositories/base.repository.interface";
import { Product } from "src/schemas/product.schema";


export interface IProductRepository extends IBaseRepository<Product> {
  findAll(): Promise<Product[]>;
  findByCategory(category: string): Promise<Product[]>;
  findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]>;
  findLowStock(threshold: number): Promise<Product[]>;
}

