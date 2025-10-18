import { Injectable, Logger } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from '../dto/product/product.dto';
import { PaginationDto } from '../dto/common/pagination.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { NotFoundException, ConflictException, ValidationException } from '../common/exceptions/custom.exceptions';
import { IProductService } from '../common/interfaces/services/product.service.interface';

@Injectable()
export class ProductService implements IProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(private readonly productRepository: ProductRepository) {}

  async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    this.logger.log('Creating new product', { name: createProductDto.name });

    // Check if name already exists
    const existingProduct = await this.productRepository.findByName(createProductDto.name);
    if (existingProduct) {
      throw new ConflictException('Product name already exists');
    }

    // Check SKU uniqueness if provided
    if (createProductDto.sku) {
      const skuExists = await this.productRepository.checkSkuExists(createProductDto.sku);
      if (skuExists) {
        throw new ConflictException('SKU already exists');
      }
    }

    // Check barcode uniqueness if provided
    if (createProductDto.barcode) {
      const barcodeExists = await this.productRepository.checkBarcodeExists(createProductDto.barcode);
      if (barcodeExists) {
        throw new ConflictException('Barcode already exists');
      }
    }

    // Validate stock levels
    if (createProductDto.minStock > createProductDto.maxStock) {
      throw new ValidationException('Minimum stock cannot be greater than maximum stock');
    }

    if (createProductDto.stock < createProductDto.minStock) {
      throw new ValidationException('Initial stock cannot be less than minimum stock');
    }

    if (createProductDto.stock > createProductDto.maxStock) {
      throw new ValidationException('Initial stock cannot be greater than maximum stock');
    }

    // Validate pricing
    if (createProductDto.costPrice > createProductDto.price) {
      throw new ValidationException('Cost price cannot be greater than selling price');
    }

    // Create product
    const product = await this.productRepository.create({
      ...createProductDto,
      category: createProductDto.category as any
    });

    this.logger.log('Product created successfully', { id: product._id });

    return this.mapToResponseDto(product);
  }

  async findAll(pagination: PaginationDto, filters?: any): Promise<any> {
    this.logger.log('Fetching products with pagination', { pagination, filters });

    const result = await this.productRepository.findProductsWithPagination(pagination, filters);
    
    return {
      ...result,
      data: result.data.map(product => this.mapToResponseDto(product))
    };
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    this.logger.log('Fetching product by id', { id });

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.mapToResponseDto(product);
  }

  async findBySku(sku: string): Promise<ProductResponseDto> {
    this.logger.log('Fetching product by SKU', { sku });

    const product = await this.productRepository.findBySku(sku);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.mapToResponseDto(product);
  }

  async findByBarcode(barcode: string): Promise<ProductResponseDto> {
    this.logger.log('Fetching product by barcode', { barcode });

    const product = await this.productRepository.findByBarcode(barcode);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.mapToResponseDto(product);
  }

  async findByCategory(categoryId: string): Promise<ProductResponseDto[]> {
    this.logger.log('Fetching products by category', { categoryId });

    const products = await this.productRepository.findByCategory(categoryId);
    return products.map(product => this.mapToResponseDto(product));
  }

  async findFeaturedProducts(): Promise<ProductResponseDto[]> {
    this.logger.log('Fetching featured products');

    const products = await this.productRepository.findFeaturedProducts();
    return products.map(product => this.mapToResponseDto(product));
  }

  async findLowStockProducts(): Promise<ProductResponseDto[]> {
    this.logger.log('Fetching low stock products');

    const products = await this.productRepository.findLowStockProducts();
    return products.map(product => this.mapToResponseDto(product));
  }

  async findOutOfStockProducts(): Promise<ProductResponseDto[]> {
    this.logger.log('Fetching out of stock products');

    const products = await this.productRepository.findOutOfStockProducts();
    return products.map(product => this.mapToResponseDto(product));
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    this.logger.log('Updating product', { id });

    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    // Check name uniqueness if name is being updated
    if (updateProductDto.name && updateProductDto.name !== existingProduct.name) {
      const nameExists = await this.productRepository.checkNameExists(updateProductDto.name, id);
      if (nameExists) {
        throw new ConflictException('Product name already exists');
      }
    }

    // Check SKU uniqueness if SKU is being updated
    if (updateProductDto.sku && updateProductDto.sku !== existingProduct.sku) {
      const skuExists = await this.productRepository.checkSkuExists(updateProductDto.sku, id);
      if (skuExists) {
        throw new ConflictException('SKU already exists');
      }
    }

    // Check barcode uniqueness if barcode is being updated
    if (updateProductDto.barcode && updateProductDto.barcode !== existingProduct.barcode) {
      const barcodeExists = await this.productRepository.checkBarcodeExists(updateProductDto.barcode, id);
      if (barcodeExists) {
        throw new ConflictException('Barcode already exists');
      }
    }

    // Validate stock levels if being updated
    if (updateProductDto.minStock !== undefined || updateProductDto.maxStock !== undefined) {
      const minStock = updateProductDto.minStock ?? existingProduct.minStock;
      const maxStock = updateProductDto.maxStock ?? existingProduct.maxStock;
      
      if (minStock > maxStock) {
        throw new ValidationException('Minimum stock cannot be greater than maximum stock');
      }
    }

    // Validate pricing if being updated
    if (updateProductDto.costPrice !== undefined || updateProductDto.price !== undefined) {
      const costPrice = updateProductDto.costPrice ?? existingProduct.costPrice;
      const price = updateProductDto.price ?? existingProduct.price;
      
      if (costPrice > price) {
        throw new ValidationException('Cost price cannot be greater than selling price');
      }
    }

    const updatedProduct = await this.productRepository.updateById(id, {
      ...updateProductDto,
      updatedAt: new Date(),
    });

    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    this.logger.log('Product updated successfully', { id });

    return this.mapToResponseDto(updatedProduct);
  }

  async remove(id: string): Promise<void> {
    this.logger.log('Deleting product', { id });

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Soft delete
    await this.productRepository.updateById(id, {
      isActive: false,
      updatedAt: new Date(),
    });

    this.logger.log('Product deleted successfully', { id });
  }

  async getStats(): Promise<any> {
    this.logger.log('Fetching product statistics');

    const stats = await this.productRepository.getProductStats();
    return ResponseUtil.success(stats, 'Product statistics retrieved successfully');
  }

  async updateStock(id: string, quantity: number, operation: 'add' | 'subtract' = 'subtract'): Promise<ProductResponseDto> {
    this.logger.log('Updating product stock', { id, quantity, operation });

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Validate stock operation
    if (operation === 'subtract' && product.stock < quantity) {
      throw new ValidationException('Insufficient stock');
    }

    const updatedProduct = await this.productRepository.updateStock(id, quantity, operation);
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    this.logger.log('Product stock updated successfully', { id, quantity, operation });

    return this.mapToResponseDto(updatedProduct);
  }

  async updateSalesData(id: string, quantity: number, revenue: number): Promise<ProductResponseDto> {
    this.logger.log('Updating product sales data', { id, quantity, revenue });

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const updatedProduct = await this.productRepository.updateSalesData(id, quantity, revenue);
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    this.logger.log('Product sales data updated successfully', { id, quantity, revenue });

    return this.mapToResponseDto(updatedProduct);
  }

  async updateStatus(id: string, status: string): Promise<ProductResponseDto> {
    this.logger.log('Updating product status', { id, status });

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const updatedProduct = await this.productRepository.updateStatus(id, status);
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    this.logger.log('Product status updated successfully', { id, status });

    return this.mapToResponseDto(updatedProduct);
  }

  async updateFeaturedStatus(id: string, isFeatured: boolean): Promise<ProductResponseDto> {
    this.logger.log('Updating product featured status', { id, isFeatured });

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const updatedProduct = await this.productRepository.updateFeaturedStatus(id, isFeatured);
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    this.logger.log('Product featured status updated successfully', { id, isFeatured });

    return this.mapToResponseDto(updatedProduct);
  }

  async searchProducts(searchTerm: string, limit: number = 10): Promise<ProductResponseDto[]> {
    this.logger.log('Searching products', { searchTerm, limit });

    const products = await this.productRepository.searchProducts(searchTerm, limit);
    return products.map(product => this.mapToResponseDto(product));
  }

  async findProductsByTags(tags: string[]): Promise<ProductResponseDto[]> {
    this.logger.log('Fetching products by tags', { tags });

    const products = await this.productRepository.findProductsByTags(tags);
    return products.map(product => this.mapToResponseDto(product));
  }

  private mapToResponseDto(product: any): ProductResponseDto {
    return {
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      category: {
        id: product.category.toString(),
        name: product.categoryName || 'Unknown Category'
      },
      price: product.price,
      costPrice: product.costPrice,
      stock: product.stock,
      minStock: product.minStock,
      maxStock: product.maxStock,
      images: product.images,
      status: product.status,
      specifications: product.specifications,
      dimensions: product.dimensions,
      pricing: product.pricing,
      tags: product.tags,
      metadata: product.metadata,
      totalSold: product.totalSold,
      totalRevenue: product.totalRevenue,
      sku: product.sku,
      barcode: product.barcode,
      isFeatured: product.isFeatured,
      rating: product.rating,
      reviewCount: product.reviewCount,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  // Interface compliance methods
  async createProduct(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    return this.create(createProductDto);
  }

  async findAllProducts(paginationDto: PaginationDto): Promise<{ data: ProductResponseDto[]; total: number; page: number; limit: number }> {
    return this.findAll(paginationDto);
  }

  async findProductById(id: string): Promise<ProductResponseDto> {
    return this.findOne(id);
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    return this.update(id, updateProductDto);
  }

  async deleteProduct(id: string): Promise<void> {
    return this.remove(id);
  }

  async getProductsByCategory(categoryId: string): Promise<ProductResponseDto[]> {
    return this.findByCategory(categoryId);
  }

  async getProductsByVendor(vendorId: string): Promise<ProductResponseDto[]> {
    // This would need to be implemented in the repository
    return [];
  }

  async getLowStockProducts(threshold?: number): Promise<ProductResponseDto[]> {
    return this.findLowStockProducts();
  }

  async getOutOfStockProducts(): Promise<ProductResponseDto[]> {
    return this.findOutOfStockProducts();
  }

  async getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<ProductResponseDto[]> {
    // This would need to be implemented in the repository
    return [];
  }

  async checkNameExists(name: string, categoryId: string, excludeId?: string): Promise<boolean> {
    return this.productRepository.checkNameExists(name, excludeId);
  }

  async findByName(name: string): Promise<ProductResponseDto | null> {
    const product = await this.productRepository.findByName(name);
    return product ? this.mapToResponseDto(product) : null;
  }

  async getProductWithCategory(id: string): Promise<ProductResponseDto> {
    return this.findOne(id);
  }

  async getProductStats(): Promise<any> {
    return this.getStats();
  }
}
