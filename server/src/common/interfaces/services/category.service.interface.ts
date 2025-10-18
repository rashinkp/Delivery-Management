import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto } from '../../../dto/category/category.dto';
import { PaginationDto } from '../../../dto/common/pagination.dto';

export interface ICategoryService {
  // CRUD operations
  createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto>;
  findAllCategories(paginationDto: PaginationDto): Promise<{ data: CategoryResponseDto[]; total: number; page: number; limit: number }>;
  findCategoryById(id: string): Promise<CategoryResponseDto>;
  updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto>;
  deleteCategory(id: string): Promise<void>;

  // Business logic
  getParentCategories(): Promise<CategoryResponseDto[]>;
  getSubCategories(parentId: string): Promise<CategoryResponseDto[]>;
  getCategoryHierarchy(): Promise<Array<{ category: CategoryResponseDto; subCategories: CategoryResponseDto[] }>>;
  moveCategory(categoryId: string, newParentId: string | null): Promise<CategoryResponseDto>;
  getCategoriesByParent(parentId: string): Promise<CategoryResponseDto[]>;

  // Utility methods
  checkNameExists(name: string, parentId?: string, excludeId?: string): Promise<boolean>;
  findByName(name: string): Promise<CategoryResponseDto | null>;
  getCategoryWithProducts(id: string): Promise<CategoryResponseDto>;
}
