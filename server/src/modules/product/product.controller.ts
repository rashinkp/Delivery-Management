import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
  UsePipes,
  ValidationPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import type { IProductService } from './interfaces/product.service.interface';
import { Roles } from 'src/common/decorators/role.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ProductController {
  constructor(
    @Inject('IProductService')
    private readonly productService: IProductService,
  ) {}

  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ApiResponseDto<any>> {
    try {
      const product = await this.productService.create(createProductDto);
      return ApiResponseDto.success(product, 'Product created successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to create product', error.message);
    }
  }

  @Get()
  @Roles('admin', 'driver')
  async findAll(@Query() query: import('./dto/product-query.dto').ProductQueryDto): Promise<ApiResponseDto<any>> {
    try {
      const result = await this.productService.findWithPagination(query);
      return ApiResponseDto.success(
        result,
        'Products retrieved successfully',
      );
    } catch (error) {
      return ApiResponseDto.error('Failed to retrieve products', error.message);
    }
  }

  @Get('category/:category')
  @Roles('admin', 'driver') // Both admin and drivers can filter by category
  async findByCategory(
    @Param('category') category: string,
  ): Promise<ApiResponseDto<any>> {
    try {
      const products = await this.productService.findByCategory(category);
      return ApiResponseDto.success(
        products,
        'Products retrieved successfully',
      );
    } catch (error) {
      return ApiResponseDto.error('Failed to retrieve products', error.message);
    }
  }

  @Get('price-range')
  @Roles('admin', 'driver') // Both admin and drivers can filter by price range
  async findByPriceRange(
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
  ): Promise<ApiResponseDto<any>> {
    try {
      const products = await this.productService.findByPriceRange(
        minPrice,
        maxPrice,
      );
      return ApiResponseDto.success(
        products,
        'Products retrieved successfully',
      );
    } catch (error) {
      return ApiResponseDto.error('Failed to retrieve products', error.message);
    }
  }

  @Get('low-stock')
  @Roles('admin') // Only admin can check low stock
  async findLowStock(
    @Query('threshold') threshold: number,
  ): Promise<ApiResponseDto<any>> {
    try {
      const products = await this.productService.findLowStock(threshold);
      return ApiResponseDto.success(
        products,
        'Low stock products retrieved successfully',
      );
    } catch (error) {
      return ApiResponseDto.error(
        'Failed to retrieve low stock products',
        error.message,
      );
    }
  }

  @Get(':id')
  @Roles('admin', 'driver') // Both admin and drivers can view specific products
  async findOne(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    try {
      const product = await this.productService.findById(id);
      return ApiResponseDto.success(product, 'Product retrieved successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to retrieve product', error.message);
    }
  }

  @Patch(':id')
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ApiResponseDto<any>> {
    try {
      const product = await this.productService.update(id, updateProductDto);
      return ApiResponseDto.success(product, 'Product updated successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to update product', error.message);
    }
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    try {
      await this.productService.remove(id);
      return ApiResponseDto.success(null, 'Product deleted successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to delete product', error.message);
    }
  }
}

