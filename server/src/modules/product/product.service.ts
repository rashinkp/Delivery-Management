import {
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import type { IProductRepository } from './interfaces/product.repository.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductMapper } from './mappers/product.mapper';
import { IProductService } from './interfaces/product.service.interface';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.productRepository.create(createProductDto);
    return ProductMapper.toResponseDto(product);
  } 

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findAll();
    return ProductMapper.toResponseDtoList(products);
  }

  async findById(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return ProductMapper.toResponseDto(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.findById(id);
    const updatedProduct = await this.productRepository.update(id, updateProductDto);
    return ProductMapper.toResponseDto(updatedProduct);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findById(id);
    const deleted = await this.productRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Failed to delete product');
    }
  }

  async findByCategory(category: string): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findByCategory(category);
    return ProductMapper.toResponseDtoList(products);
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findByPriceRange(minPrice, maxPrice);
    return ProductMapper.toResponseDtoList(products);
  }

  async findLowStock(threshold: number): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findLowStock(threshold);
    return ProductMapper.toResponseDtoList(products);
  }

  async findWithPagination(query: ProductQueryDto): Promise<{
    data: ProductResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const result = await this.productRepository.findWithPagination(query);
    return {
      ...result,
      data: ProductMapper.toResponseDtoList(result.data as any),
    };
  }
}
