import { CreateProductDto, UpdateProductDto, ProductResponseDto } from '../../../dto/product/product.dto';
import { PaginationDto } from '../../../dto/common/pagination.dto';

export interface IProductService {
  // CRUD operations
  createProduct(createProductDto: CreateProductDto): Promise<ProductResponseDto>;
  findAllProducts(paginationDto: PaginationDto): Promise<{ data: ProductResponseDto[]; total: number; page: number; limit: number }>;
  findProductById(id: string): Promise<ProductResponseDto>;
  updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto>;
  deleteProduct(id: string): Promise<void>;

  // Business logic
  updateStock(id: string, quantity: number, operation: 'add' | 'subtract'): Promise<ProductResponseDto>;
  getProductsByCategory(categoryId: string): Promise<ProductResponseDto[]>;
  getProductsByVendor(vendorId: string): Promise<ProductResponseDto[]>;
  getLowStockProducts(threshold?: number): Promise<ProductResponseDto[]>;
  getOutOfStockProducts(): Promise<ProductResponseDto[]>;
  searchProducts(query: string): Promise<ProductResponseDto[]>;
  getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<ProductResponseDto[]>;

  // Utility methods
  checkNameExists(name: string, categoryId: string, excludeId?: string): Promise<boolean>;
  findByName(name: string): Promise<ProductResponseDto | null>;
  getProductWithCategory(id: string): Promise<ProductResponseDto>;
  getProductStats(): Promise<any>;
}
