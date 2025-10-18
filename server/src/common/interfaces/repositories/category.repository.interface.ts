import { CategoryDocument } from '../../../schemas/category.schema';
import { BaseRepositoryInterface } from '../../repositories/base.repository.interface';

export interface ICategoryRepository extends BaseRepositoryInterface<CategoryDocument> {
  // Category-specific methods
  findByName(name: string, parentId?: string): Promise<CategoryDocument | null>;
  checkNameExists(name: string, parentId?: string, excludeId?: string): Promise<boolean>;
  findParentCategories(): Promise<CategoryDocument[]>;
  findSubCategories(parentId: string): Promise<CategoryDocument[]>;
  findCategoriesByParent(parentId: string): Promise<CategoryDocument[]>;
  getCategoryHierarchy(): Promise<Array<{ category: CategoryDocument; subCategories: CategoryDocument[] }>>;
  moveCategory(categoryId: string, newParentId: string | null): Promise<CategoryDocument | null>;
  getCategoryWithProducts(categoryId: string): Promise<CategoryDocument | null>;
  findActiveCategories(): Promise<CategoryDocument[]>;
}
