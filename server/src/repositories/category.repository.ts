import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../common/repositories/base.repository';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { PaginationDto } from '../dto/common/pagination.dto';

@Injectable()
export class CategoryRepository extends BaseRepository<CategoryDocument> {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>) {
    super(categoryModel);
  }

  // Custom methods specific to Category entity
  async findByName(name: string): Promise<CategoryDocument | null> {
    return this.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') }, isActive: true });
  }

  async checkNameExists(name: string, excludeId?: string): Promise<boolean> {
    const query: any = { name: { $regex: new RegExp(`^${name}$`, 'i') } };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return this.exists(query);
  }

  async findActiveCategories(): Promise<CategoryDocument[]> {
    return this.findMany({
      isActive: true,
      status: 'active'
    }, { sort: { sortOrder: 1, name: 1 } });
  }

  async findParentCategories(): Promise<CategoryDocument[]> {
    return this.findMany({
      isActive: true,
      status: 'active',
      parentCategory: { $exists: false }
    }, { sort: { sortOrder: 1, name: 1 } });
  }

  async findSubCategories(parentCategoryId: string): Promise<CategoryDocument[]> {
    return this.findMany({
      isActive: true,
      status: 'active',
      parentCategory: parentCategoryId
    }, { sort: { sortOrder: 1, name: 1 } });
  }

  async updateSortOrder(id: string, sortOrder: number): Promise<CategoryDocument | null> {
    return this.updateById(id, { sortOrder });
  }

  async updateStatus(id: string, status: string): Promise<CategoryDocument | null> {
    return this.updateById(id, { status });
  }

  async findCategoriesWithPagination(
    pagination: PaginationDto,
    filters?: {
      search?: string;
      status?: string;
      isActive?: boolean;
      parentCategory?: string;
      tags?: string[];
    }
  ): Promise<{
    data: CategoryDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, sortBy = 'sortOrder', sortOrder = 'asc' } = pagination;
    
    let query: any = {};
    
    // Apply filters
    if (filters) {
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } }
        ];
      }
      
      if (filters.status) query.status = filters.status;
      if (filters.isActive !== undefined) query.isActive = filters.isActive;
      if (filters.parentCategory) {
        if (filters.parentCategory === 'null') {
          query.parentCategory = { $exists: false };
        } else {
          query.parentCategory = filters.parentCategory;
        }
      }
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }
    }

    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    return this.findWithPagination(query, page, limit, sort);
  }

  async getCategoryStats(): Promise<{
    total: number;
    active: number;
    parentCategories: number;
    subCategories: number;
    withImages: number;
  }> {
    const pipeline = [
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          parentCategories: {
            $sum: {
              $cond: [
                { $or: [{ $eq: ['$parentCategory', null] }, { $eq: ['$parentCategory', undefined] }] },
                1,
                0
              ]
            }
          },
          subCategories: {
            $sum: {
              $cond: [
                { $and: [
                  { $ne: ['$parentCategory', null] },
                  { $ne: ['$parentCategory', undefined] }
                ]},
                1,
                0
              ]
            }
          },
          withImages: {
            $sum: {
              $cond: [
                { $and: [
                  { $ne: ['$image', null] },
                  { $ne: ['$image', ''] }
                ]},
                1,
                0
              ]
            }
          }
        }
      }
    ];

    const result = await this.aggregate(pipeline);
    return result[0] || {
      total: 0,
      active: 0,
      parentCategories: 0,
      subCategories: 0,
      withImages: 0
    };
  }

  async findCategoriesByTags(tags: string[]): Promise<CategoryDocument[]> {
    return this.findMany({
      tags: { $in: tags },
      isActive: true,
      status: 'active'
    }, { sort: { sortOrder: 1, name: 1 } });
  }

  async getCategoryHierarchy(): Promise<Array<{
    category: CategoryDocument;
    subCategories: CategoryDocument[];
  }>> {
    const parentCategories = await this.findParentCategories();
    const hierarchy = [];

    for (const parent of parentCategories) {
      const subCategories = await this.findSubCategories(parent._id.toString());
      hierarchy.push({
        category: parent,
        subCategories
      });
    }

    return hierarchy;
  }
}
