import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto, UpdateProductDto } from '../dto/product/product.dto';
import { PaginationDto } from '../dto/common/pagination.dto';
import { ResponseUtil } from '../common/utils/response.util';
import type { ApiResponse } from '../common/interfaces/api-response.interface';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto): Promise<ApiResponse<any>> {
    const product = await this.productService.create(createProductDto);
    return ResponseUtil.created(product, 'Product created successfully');
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('isFeatured') isFeatured?: boolean,
    @Query('isActive') isActive?: boolean,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('minStock') minStock?: number,
    @Query('maxStock') maxStock?: number,
    @Query('tags') tags?: string,
  ): Promise<ApiResponse<any>> {
    const filters = {
      search,
      category,
      status,
      isFeatured,
      isActive,
      minPrice,
      maxPrice,
      minStock,
      maxStock,
      tags: tags ? tags.split(',') : undefined,
    };

    const result = await this.productService.findAll(pagination, filters);
    return ResponseUtil.success(result, 'Products retrieved successfully');
  }

  @Get('stats')
  async getStats(): Promise<ApiResponse<any>> {
    return await this.productService.getStats();
  }

  @Get('featured')
  async findFeaturedProducts(): Promise<ApiResponse<any>> {
    const products = await this.productService.findFeaturedProducts();
    return ResponseUtil.success(products, 'Featured products retrieved successfully');
  }

  @Get('low-stock')
  async findLowStockProducts(): Promise<ApiResponse<any>> {
    const products = await this.productService.findLowStockProducts();
    return ResponseUtil.success(products, 'Low stock products retrieved successfully');
  }

  @Get('out-of-stock')
  async findOutOfStockProducts(): Promise<ApiResponse<any>> {
    const products = await this.productService.findOutOfStockProducts();
    return ResponseUtil.success(products, 'Out of stock products retrieved successfully');
  }

  @Get('search')
  async searchProducts(
    @Query('q') searchTerm: string,
    @Query('limit') limit: number = 10,
  ): Promise<ApiResponse<any>> {
    const products = await this.productService.searchProducts(searchTerm, limit);
    return ResponseUtil.success(products, 'Product search results retrieved successfully');
  }

  @Get('by-tags')
  async findProductsByTags(@Query('tags') tags: string): Promise<ApiResponse<any>> {
    const tagArray = tags.split(',');
    const products = await this.productService.findProductsByTags(tagArray);
    return ResponseUtil.success(products, 'Products by tags retrieved successfully');
  }

  @Get('by-category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string): Promise<ApiResponse<any>> {
    const products = await this.productService.findByCategory(categoryId);
    return ResponseUtil.success(products, 'Products by category retrieved successfully');
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<any>> {
    const product = await this.productService.findOne(id);
    return ResponseUtil.success(product, 'Product retrieved successfully');
  }

  @Get('sku/:sku')
  async findBySku(@Param('sku') sku: string): Promise<ApiResponse<any>> {
    const product = await this.productService.findBySku(sku);
    return ResponseUtil.success(product, 'Product retrieved successfully');
  }

  @Get('barcode/:barcode')
  async findByBarcode(@Param('barcode') barcode: string): Promise<ApiResponse<any>> {
    const product = await this.productService.findByBarcode(barcode);
    return ResponseUtil.success(product, 'Product retrieved successfully');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ApiResponse<any>> {
    const product = await this.productService.update(id, updateProductDto);
    return ResponseUtil.updated(product, 'Product updated successfully');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.productService.remove(id);
  }

  @Patch(':id/stock')
  async updateStock(
    @Param('id') id: string,
    @Body() body: { quantity: number; operation: 'add' | 'subtract' },
  ): Promise<ApiResponse<any>> {
    const product = await this.productService.updateStock(id, body.quantity, body.operation);
    return ResponseUtil.updated(product, 'Product stock updated successfully');
  }

  @Patch(':id/sales-data')
  async updateSalesData(
    @Param('id') id: string,
    @Body() body: { quantity: number; revenue: number },
  ): Promise<ApiResponse<any>> {
    const product = await this.productService.updateSalesData(id, body.quantity, body.revenue);
    return ResponseUtil.updated(product, 'Product sales data updated successfully');
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ): Promise<ApiResponse<any>> {
    const product = await this.productService.updateStatus(id, body.status);
    return ResponseUtil.updated(product, 'Product status updated successfully');
  }

  @Patch(':id/featured')
  async updateFeaturedStatus(
    @Param('id') id: string,
    @Body() body: { isFeatured: boolean },
  ): Promise<ApiResponse<any>> {
    const product = await this.productService.updateFeaturedStatus(id, body.isFeatured);
    return ResponseUtil.updated(product, 'Product featured status updated successfully');
  }
}
