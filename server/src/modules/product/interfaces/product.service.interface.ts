// src/products/interfaces/product.service.interface.ts

import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductResponseDto } from '../dto/product-response.dto';

export interface IProductService {
  /**
   * Creates a new product.
   * @param createProductDto - Data transfer object for creating a product.
   * @returns The created product as a response DTO.
   */
  create(createProductDto: CreateProductDto): Promise<ProductResponseDto>;

  /**
   * Retrieves all products.
   * @returns A list of product response DTOs.
   */
  findAll(): Promise<ProductResponseDto[]>;

  /**
   * Finds a product by its ID.
   * @param id - The unique identifier of the product.
   * @returns The product response DTO.
   * @throws NotFoundException if the product is not found.
   */
  findById(id: string): Promise<ProductResponseDto>;

  /**
   * Updates an existing product.
   * @param id - The ID of the product to update.
   * @param updateProductDto - Partial data to update the product.
   * @returns The updated product response DTO.
   * @throws NotFoundException if the product is not found.
   */
  update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto>;

  /**
   * Deletes a product by its ID.
   * @param id - The ID of the product to delete.
   * @throws NotFoundException if the product is not found or deletion fails.
   */
  remove(id: string): Promise<void>;

  /**
   * Finds products by category.
   * @param category - The category name to filter products.
   * @returns A list of matching product response DTOs.
   */
  findByCategory(category: string): Promise<ProductResponseDto[]>;

  /**
   * Finds products within a price range.
   * @param minPrice - Minimum price (inclusive).
   * @param maxPrice - Maximum price (inclusive).
   * @returns A list of products in the specified price range.
   */
  findByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<ProductResponseDto[]>;

  /**
   * Finds products with low stock.
   * @param threshold - Stock quantity threshold (e.g., <= threshold).
   * @returns A list of low-stock product response DTOs.
   */
  findLowStock(threshold: number): Promise<ProductResponseDto[]>;
  findWithPagination(
    query: import('../dto/product-query.dto').ProductQueryDto,
  ): Promise<{
    data: ProductResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }>;
}
