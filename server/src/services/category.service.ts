import { Injectable, Logger } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto } from '../dto/category/category.dto';
import { PaginationDto } from '../dto/common/pagination.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { NotFoundException, ConflictException, ValidationException } from '../common/exceptions/custom.exceptions';
import { ICategoryService } from '../common/interfaces/services/category.service.interface';

@Injectable()
export class CategoryService implements ICategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(createCategoryDto: any): Promise<any> {
    this.logger.log('Creating new category', { name: createCategoryDto.name });

    // Check if name already exists
    const existingCategory = await this.categoryRepository.findByName(createCategoryDto.name);
    if (existingCategory) {
      throw new ConflictException('Category name already exists');
    }

    // Validate parent category if provided
    if (createCategoryDto.parentCategory) {
      const parentCategory = await this.categoryRepository.findById(createCategoryDto.parentCategory);
      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }
    }

    // Create category
    const category = await this.categoryRepository.create(createCategoryDto);

    this.logger.log('Category created successfully', { id: category._id });

    return this.mapToResponseDto(category);
  }

  async findAll(pagination: PaginationDto, filters?: any): Promise<any> {
    this.logger.log('Fetching categories with pagination', { pagination, filters });

    const result = await this.categoryRepository.findCategoriesWithPagination(pagination, filters);
    
    return {
      ...result,
      data: result.data.map(category => this.mapToResponseDto(category))
    };
  }

  async findOne(id: string): Promise<any> {
    this.logger.log('Fetching category by id', { id });

    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.mapToResponseDto(category);
  }


  async findActiveCategories(): Promise<any[]> {
    this.logger.log('Fetching active categories');

    const categories = await this.categoryRepository.findActiveCategories();
    return categories.map(category => this.mapToResponseDto(category));
  }

  async findParentCategories(): Promise<any[]> {
    this.logger.log('Fetching parent categories');

    const categories = await this.categoryRepository.findParentCategories();
    return categories.map(category => this.mapToResponseDto(category));
  }

  async findSubCategories(parentCategoryId: string): Promise<any[]> {
    this.logger.log('Fetching sub categories', { parentCategoryId });

    const categories = await this.categoryRepository.findSubCategories(parentCategoryId);
    return categories.map(category => this.mapToResponseDto(category));
  }

  async update(id: string, updateCategoryDto: any): Promise<any> {
    this.logger.log('Updating category', { id });

    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    // Check name uniqueness if name is being updated
    if (updateCategoryDto.name && updateCategoryDto.name !== existingCategory.name) {
      const nameExists = await this.categoryRepository.checkNameExists(updateCategoryDto.name, id);
      if (nameExists) {
        throw new ConflictException('Category name already exists');
      }
    }

    // Validate parent category if being updated
    if (updateCategoryDto.parentCategory) {
      if (updateCategoryDto.parentCategory === id) {
        throw new ValidationException('Category cannot be its own parent');
      }
      
      const parentCategory = await this.categoryRepository.findById(updateCategoryDto.parentCategory);
      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }
    }

    const updatedCategory = await this.categoryRepository.updateById(id, {
      ...updateCategoryDto,
      updatedAt: new Date(),
    });

    if (!updatedCategory) {
      throw new NotFoundException('Category not found');
    }

    this.logger.log('Category updated successfully', { id });

    return this.mapToResponseDto(updatedCategory);
  }

  async remove(id: string): Promise<void> {
    this.logger.log('Deleting category', { id });

    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if category has sub-categories
    const subCategories = await this.categoryRepository.findSubCategories(id);
    if (subCategories.length > 0) {
      throw new ValidationException('Cannot delete category with sub-categories');
    }

    // Soft delete
    await this.categoryRepository.updateById(id, {
      isActive: false,
      updatedAt: new Date(),
    });

    this.logger.log('Category deleted successfully', { id });
  }

  async getStats(): Promise<any> {
    this.logger.log('Fetching category statistics');

    const stats = await this.categoryRepository.getCategoryStats();
    return ResponseUtil.success(stats, 'Category statistics retrieved successfully');
  }

  async updateSortOrder(id: string, sortOrder: number): Promise<any> {
    this.logger.log('Updating category sort order', { id, sortOrder });

    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const updatedCategory = await this.categoryRepository.updateSortOrder(id, sortOrder);
    if (!updatedCategory) {
      throw new NotFoundException('Category not found');
    }

    this.logger.log('Category sort order updated successfully', { id, sortOrder });

    return this.mapToResponseDto(updatedCategory);
  }

  async updateStatus(id: string, status: string): Promise<any> {
    this.logger.log('Updating category status', { id, status });

    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const updatedCategory = await this.categoryRepository.updateStatus(id, status);
    if (!updatedCategory) {
      throw new NotFoundException('Category not found');
    }

    this.logger.log('Category status updated successfully', { id, status });

    return this.mapToResponseDto(updatedCategory);
  }

  async findCategoriesByTags(tags: string[]): Promise<any[]> {
    this.logger.log('Fetching categories by tags', { tags });

    const categories = await this.categoryRepository.findCategoriesByTags(tags);
    return categories.map(category => this.mapToResponseDto(category));
  }

  async getCategoryHierarchy(): Promise<any[]> {
    this.logger.log('Fetching category hierarchy');

    const hierarchy = await this.categoryRepository.getCategoryHierarchy();
    return hierarchy.map(item => ({
      category: this.mapToResponseDto(item.category),
      subCategories: item.subCategories.map(subCategory => this.mapToResponseDto(subCategory))
    }));
  }

  private mapToResponseDto(category: any): any {
    return {
      id: category._id.toString(),
      name: category.name,
      description: category.description,
      image: category.image,
      sortOrder: category.sortOrder,
      status: category.status,
      metadata: category.metadata,
      tags: category.tags,
      parentCategory: category.parentCategory,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  // Interface compliance methods
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.create(createCategoryDto);
  }

  async findAllCategories(paginationDto: PaginationDto): Promise<{ data: CategoryResponseDto[]; total: number; page: number; limit: number }> {
    return this.findAll(paginationDto);
  }

  async findCategoryById(id: string): Promise<CategoryResponseDto> {
    return this.findOne(id);
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    return this.update(id, updateCategoryDto);
  }

  async deleteCategory(id: string): Promise<void> {
    return this.remove(id);
  }

  async getParentCategories(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.findParentCategories();
    return categories.map(category => this.mapToResponseDto(category));
  }

  async getSubCategories(parentId: string): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.findSubCategories(parentId);
    return categories.map(category => this.mapToResponseDto(category));
  }

  async moveCategory(categoryId: string, newParentId: string | null): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.moveCategory(categoryId, newParentId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.mapToResponseDto(category);
  }

  async getCategoriesByParent(parentId: string): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.findCategoriesByParent(parentId);
    return categories.map(category => this.mapToResponseDto(category));
  }

  async checkNameExists(name: string, parentId?: string, excludeId?: string): Promise<boolean> {
    return this.categoryRepository.checkNameExists(name, excludeId);
  }

  async findByName(name: string): Promise<CategoryResponseDto | null> {
    const category = await this.categoryRepository.findByName(name);
    return category ? this.mapToResponseDto(category) : null;
  }

  async getCategoryWithProducts(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.getCategoryWithProducts(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.mapToResponseDto(category);
  }
}
