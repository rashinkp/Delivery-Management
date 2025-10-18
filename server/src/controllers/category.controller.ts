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
import { CategoryService } from '../services/category.service';
import { PaginationDto } from '../dto/common/pagination.dto';
import { ResponseUtil } from '../common/utils/response.util';
import type { ApiResponse } from '../common/interfaces/api-response.interface';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: any): Promise<ApiResponse<any>> {
    const category = await this.categoryService.create(createCategoryDto);
    return ResponseUtil.created(category, 'Category created successfully');
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('isActive') isActive?: boolean,
    @Query('parentCategory') parentCategory?: string,
    @Query('tags') tags?: string,
  ): Promise<ApiResponse<any>> {
    const filters = {
      search,
      status,
      isActive,
      parentCategory,
      tags: tags ? tags.split(',') : undefined,
    };

    const result = await this.categoryService.findAll(pagination, filters);
    return ResponseUtil.success(result, 'Categories retrieved successfully');
  }

  @Get('stats')
  async getStats(): Promise<ApiResponse<any>> {
    return await this.categoryService.getStats();
  }

  @Get('active')
  async findActiveCategories(): Promise<ApiResponse<any>> {
    const categories = await this.categoryService.findActiveCategories();
    return ResponseUtil.success(categories, 'Active categories retrieved successfully');
  }

  @Get('parent')
  async findParentCategories(): Promise<ApiResponse<any>> {
    const categories = await this.categoryService.findParentCategories();
    return ResponseUtil.success(categories, 'Parent categories retrieved successfully');
  }

  @Get('hierarchy')
  async getCategoryHierarchy(): Promise<ApiResponse<any>> {
    const hierarchy = await this.categoryService.getCategoryHierarchy();
    return ResponseUtil.success(hierarchy, 'Category hierarchy retrieved successfully');
  }

  @Get('by-tags')
  async findCategoriesByTags(@Query('tags') tags: string): Promise<ApiResponse<any>> {
    const tagArray = tags.split(',');
    const categories = await this.categoryService.findCategoriesByTags(tagArray);
    return ResponseUtil.success(categories, 'Categories by tags retrieved successfully');
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<any>> {
    const category = await this.categoryService.findOne(id);
    return ResponseUtil.success(category, 'Category retrieved successfully');
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string): Promise<ApiResponse<any>> {
    const category = await this.categoryService.findByName(name);
    return ResponseUtil.success(category, 'Category retrieved successfully');
  }

  @Get(':id/sub-categories')
  async findSubCategories(@Param('id') id: string): Promise<ApiResponse<any>> {
    const subCategories = await this.categoryService.findSubCategories(id);
    return ResponseUtil.success(subCategories, 'Sub categories retrieved successfully');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: any,
  ): Promise<ApiResponse<any>> {
    const category = await this.categoryService.update(id, updateCategoryDto);
    return ResponseUtil.updated(category, 'Category updated successfully');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.categoryService.remove(id);
  }

  @Patch(':id/sort-order')
  async updateSortOrder(
    @Param('id') id: string,
    @Body() body: { sortOrder: number },
  ): Promise<ApiResponse<any>> {
    const category = await this.categoryService.updateSortOrder(id, body.sortOrder);
    return ResponseUtil.updated(category, 'Category sort order updated successfully');
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ): Promise<ApiResponse<any>> {
    const category = await this.categoryService.updateStatus(id, body.status);
    return ResponseUtil.updated(category, 'Category status updated successfully');
  }
}
