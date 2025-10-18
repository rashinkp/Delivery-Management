import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto, UpdateProductDto } from '../dto/product/product.dto';
import { PaginationDto } from '../dto/common/pagination.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { USER_ROLES } from '../common/constants/app-constants';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.create(createProductDto);
    return ResponseUtil.success(product, 'Product created successfully');
  }

  @Get()
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.productService.findAll(paginationDto);
    return ResponseUtil.success(result, 'Products retrieved successfully');
  }

  @Get('active')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findActive() {
    // This would need to be implemented in the service
    return ResponseUtil.error('Method not implemented', 'findActiveProducts');
  }

  @Get('featured')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findFeatured() {
    const products = await this.productService.findFeaturedProducts();
    return ResponseUtil.success(products, 'Featured products retrieved successfully');
  }

  @Get('low-stock')
  @Roles(USER_ROLES.ADMIN)
  async findLowStock() {
    const products = await this.productService.findLowStockProducts();
    return ResponseUtil.success(products, 'Low stock products retrieved successfully');
  }

  @Get('out-of-stock')
  @Roles(USER_ROLES.ADMIN)
  async findOutOfStock() {
    const products = await this.productService.findOutOfStockProducts();
    return ResponseUtil.success(products, 'Out of stock products retrieved successfully');
  }

  @Get('by-category/:categoryId')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findByCategory(@Param('categoryId') categoryId: string) {
    const products = await this.productService.findByCategory(categoryId);
    return ResponseUtil.success(products, 'Products by category retrieved successfully');
  }

  @Get('by-vendor/:vendorId')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findByVendor(@Param('vendorId') vendorId: string) {
    // This would need to be implemented in the service
    return ResponseUtil.error('Method not implemented', 'findByVendor');
  }

  @Get('by-price-range')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findByPriceRange(
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
  ) {
    // This would need to be implemented in the service
    return ResponseUtil.error('Method not implemented', 'findByPriceRange');
  }

  @Get('search')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async search(@Query('q') query: string, @Query('limit') limit: number = 10) {
    const products = await this.productService.searchProducts(query, limit);
    return ResponseUtil.success(products, 'Product search results retrieved successfully');
  }

  @Get('by-tags')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findByTags(@Query('tags') tags: string) {
    const tagArray = tags.split(',').map(tag => tag.trim());
    const products = await this.productService.findProductsByTags(tagArray);
    return ResponseUtil.success(products, 'Products by tags retrieved successfully');
  }

  @Get('stats')
  @Roles(USER_ROLES.ADMIN)
  async getStats() {
    const stats = await this.productService.getStats();
    return ResponseUtil.success(stats, 'Product statistics retrieved successfully');
  }

  @Get(':id')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);
    return ResponseUtil.success(product, 'Product retrieved successfully');
  }

  @Patch(':id')
  @Roles(USER_ROLES.ADMIN)
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const product = await this.productService.update(id, updateProductDto);
    return ResponseUtil.success(product, 'Product updated successfully');
  }

  @Patch(':id/status')
  @Roles(USER_ROLES.ADMIN)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const product = await this.productService.updateStatus(id, status);
    return ResponseUtil.success(product, 'Product status updated successfully');
  }

  @Patch(':id/stock')
  @Roles(USER_ROLES.ADMIN)
  async updateStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
    @Body('operation') operation: 'add' | 'subtract' = 'subtract',
  ) {
    const product = await this.productService.updateStock(id, quantity, operation);
    return ResponseUtil.success(product, 'Product stock updated successfully');
  }

  @Patch(':id/featured')
  @Roles(USER_ROLES.ADMIN)
  async updateFeatured(@Param('id') id: string, @Body('isFeatured') isFeatured: boolean) {
    const product = await this.productService.updateFeaturedStatus(id, isFeatured);
    return ResponseUtil.success(product, 'Product featured status updated successfully');
  }

  @Delete(':id')
  @Roles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.productService.remove(id);
    return ResponseUtil.success(null, 'Product deleted successfully');
  }

  @Get('sku/:sku')
  @Roles(USER_ROLES.ADMIN)
  async findBySku(@Param('sku') sku: string) {
    const product = await this.productService.findBySku(sku);
    return ResponseUtil.success(product, 'Product retrieved successfully');
  }

  @Get('barcode/:barcode')
  @Roles(USER_ROLES.ADMIN)
  async findByBarcode(@Param('barcode') barcode: string) {
    const product = await this.productService.findByBarcode(barcode);
    return ResponseUtil.success(product, 'Product retrieved successfully');
  }
}