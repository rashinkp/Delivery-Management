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
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category/category.dto';
import { PaginationDto } from '../dto/common/pagination.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { USER_ROLES } from '../common/constants/app-constants';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.create(createCategoryDto);
    return ResponseUtil.success(category, 'Category created successfully');
  }

  @Get()
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.categoryService.findAll(paginationDto);
    return ResponseUtil.success(result, 'Categories retrieved successfully');
  }

  @Get('active')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findActive() {
    const categories = await this.categoryService.findActiveCategories();
    return ResponseUtil.success(categories, 'Active categories retrieved successfully');
  }

  @Get('parent')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findParentCategories() {
    const categories = await this.categoryService.findParentCategories();
    return ResponseUtil.success(categories, 'Parent categories retrieved successfully');
  }

  @Get('parent/:parentId/subcategories')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findSubCategories(@Param('parentId') parentId: string) {
    const categories = await this.categoryService.findSubCategories(parentId);
    return ResponseUtil.success(categories, 'Subcategories retrieved successfully');
  }

  @Get('hierarchy')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async getHierarchy() {
    const hierarchy = await this.categoryService.getCategoryHierarchy();
    return ResponseUtil.success(hierarchy, 'Category hierarchy retrieved successfully');
  }

  @Get('by-tags')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findByTags(@Query('tags') tags: string) {
    const tagArray = tags.split(',').map(tag => tag.trim());
    const categories = await this.categoryService.findCategoriesByTags(tagArray);
    return ResponseUtil.success(categories, 'Categories by tags retrieved successfully');
  }

  @Get('stats')
  @Roles(USER_ROLES.ADMIN)
  async getStats() {
    const stats = await this.categoryService.getStats();
    return ResponseUtil.success(stats, 'Category statistics retrieved successfully');
  }

  @Get(':id')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne(id);
    return ResponseUtil.success(category, 'Category retrieved successfully');
  }

  @Patch(':id')
  @Roles(USER_ROLES.ADMIN)
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryService.update(id, updateCategoryDto);
    return ResponseUtil.success(category, 'Category updated successfully');
  }

  @Patch(':id/status')
  @Roles(USER_ROLES.ADMIN)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const category = await this.categoryService.updateStatus(id, status);
    return ResponseUtil.success(category, 'Category status updated successfully');
  }

  @Patch(':id/sort-order')
  @Roles(USER_ROLES.ADMIN)
  async updateSortOrder(@Param('id') id: string, @Body('sortOrder') sortOrder: number) {
    const category = await this.categoryService.updateSortOrder(id, sortOrder);
    return ResponseUtil.success(category, 'Category sort order updated successfully');
  }

  @Patch(':id/move')
  @Roles(USER_ROLES.ADMIN)
  async moveCategory(
    @Param('id') id: string,
    @Body('newParentId') newParentId: string | null,
  ) {
    // Update the parent category directly
    const category = await this.categoryService.update(id, { parentCategory: newParentId });
    return ResponseUtil.success(category, 'Category moved successfully');
  }

  @Delete(':id')
  @Roles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.categoryService.remove(id);
    return ResponseUtil.success(null, 'Category deleted successfully');
  }

  @Get('name/:name')
  @Roles(USER_ROLES.ADMIN)
  async findByName(@Param('name') name: string) {
    const category = await this.categoryService.findByName(name);
    return ResponseUtil.success(category, 'Category retrieved successfully');
  }
}