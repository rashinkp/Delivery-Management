import { ProductDocument } from '../../../schemas/product.schema';
import { BaseRepositoryInterface } from '../../repositories/base.repository.interface';

export interface IProductRepository extends BaseRepositoryInterface<ProductDocument> {
  // Product-specific methods
  findByName(name: string, categoryId?: string): Promise<ProductDocument | null>;
  checkNameExists(name: string, categoryId: string, excludeId?: string): Promise<boolean>;
  findByCategory(categoryId: string): Promise<ProductDocument[]>;
  findByVendor(vendorId: string): Promise<ProductDocument[]>;
  findLowStockProducts(threshold?: number): Promise<ProductDocument[]>;
  findOutOfStockProducts(): Promise<ProductDocument[]>;
  searchProducts(query: string): Promise<ProductDocument[]>;
  findByPriceRange(minPrice: number, maxPrice: number): Promise<ProductDocument[]>;
  updateStock(productId: string, quantity: number, operation: 'add' | 'subtract'): Promise<ProductDocument | null>;
  getProductWithCategory(productId: string): Promise<ProductDocument | null>;
  getProductStats(): Promise<any>;
  findActiveProducts(): Promise<ProductDocument[]>;
}
