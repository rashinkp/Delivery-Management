import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../common/repositories/base.repository';
import { Product, ProductDocument } from '../schemas/product.schema';
import { CreateProductDto, UpdateProductDto } from '../dto/product/product.dto';
import { PaginationDto } from '../dto/common/pagination.dto';

@Injectable()
export class ProductRepository extends BaseRepository<ProductDocument> {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) {
    super(productModel);
  }

  // Custom methods specific to Product entity
  async findByName(name: string): Promise<ProductDocument | null> {
    return this.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') }, isActive: true });
  }

  async findBySku(sku: string): Promise<ProductDocument | null> {
    return this.findOne({ sku, isActive: true });
  }

  async findByBarcode(barcode: string): Promise<ProductDocument | null> {
    return this.findOne({ barcode, isActive: true });
  }

  async checkNameExists(name: string, excludeId?: string): Promise<boolean> {
    const query: any = { name: { $regex: new RegExp(`^${name}$`, 'i') } };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return this.exists(query);
  }

  async checkSkuExists(sku: string, excludeId?: string): Promise<boolean> {
    const query: any = { sku };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return this.exists(query);
  }

  async checkBarcodeExists(barcode: string, excludeId?: string): Promise<boolean> {
    const query: any = { barcode };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return this.exists(query);
  }

  async findByCategory(categoryId: string): Promise<ProductDocument[]> {
    return this.findMany({
      category: categoryId,
      isActive: true,
      status: 'active'
    }, { sort: { name: 1 } });
  }

  async findFeaturedProducts(): Promise<ProductDocument[]> {
    return this.findMany({
      isFeatured: true,
      isActive: true,
      status: 'active'
    }, { sort: { rating: -1, totalSold: -1 } });
  }

  async findLowStockProducts(): Promise<ProductDocument[]> {
    return this.findMany({
      isActive: true,
      $expr: { $lte: ['$stock', '$minStock'] }
    }, { sort: { stock: 1 } });
  }

  async findOutOfStockProducts(): Promise<ProductDocument[]> {
    return this.findMany({
      isActive: true,
      stock: 0
    }, { sort: { name: 1 } });
  }

  async updateStock(id: string, quantity: number, operation: 'add' | 'subtract' = 'subtract'): Promise<ProductDocument | null> {
    const updateQuery = operation === 'add' 
      ? { $inc: { stock: quantity } }
      : { $inc: { stock: -quantity } };
    
    return this.updateById(id, updateQuery);
  }

  async updateSalesData(id: string, quantity: number, revenue: number): Promise<ProductDocument | null> {
    return this.updateById(id, {
      $inc: {
        totalSold: quantity,
        totalRevenue: revenue
      }
    });
  }

  async updateStatus(id: string, status: string): Promise<ProductDocument | null> {
    return this.updateById(id, { status });
  }

  async updateFeaturedStatus(id: string, isFeatured: boolean): Promise<ProductDocument | null> {
    return this.updateById(id, { isFeatured });
  }

  async findProductsWithPagination(
    pagination: PaginationDto,
    filters?: {
      search?: string;
      category?: string;
      status?: string;
      isFeatured?: boolean;
      isActive?: boolean;
      minPrice?: number;
      maxPrice?: number;
      minStock?: number;
      maxStock?: number;
      tags?: string[];
    }
  ): Promise<{
    data: ProductDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    
    let query: any = {};
    
    // Apply filters
    if (filters) {
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } },
          { sku: { $regex: filters.search, $options: 'i' } },
          { barcode: { $regex: filters.search, $options: 'i' } }
        ];
      }
      
      if (filters.category) query.category = filters.category;
      if (filters.status) query.status = filters.status;
      if (filters.isFeatured !== undefined) query.isFeatured = filters.isFeatured;
      if (filters.isActive !== undefined) query.isActive = filters.isActive;
      
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.price = {};
        if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
        if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
      }
      
      if (filters.minStock !== undefined || filters.maxStock !== undefined) {
        query.stock = {};
        if (filters.minStock !== undefined) query.stock.$gte = filters.minStock;
        if (filters.maxStock !== undefined) query.stock.$lte = filters.maxStock;
      }
      
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }
    }

    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    return this.findWithPagination(query, page, limit, sort);
  }

  async getProductStats(): Promise<{
    total: number;
    active: number;
    outOfStock: number;
    lowStock: number;
    featured: number;
    totalValue: number;
    byCategory: Array<{ category: string; count: number }>;
    topSelling: Array<{ product: string; totalSold: number }>;
  }> {
    const pipeline = [
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          outOfStock: { $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] } },
          lowStock: {
            $sum: {
              $cond: [
                { $expr: { $lte: ['$stock', '$minStock'] } },
                1,
                0
              ]
            }
          },
          featured: { $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] } },
          totalValue: { $sum: { $multiply: ['$stock', '$price'] } }
        }
      }
    ];

    const categoryStats = await this.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const topSelling = await this.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $sort: { totalSold: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          product: '$name',
          totalSold: 1
        }
      }
    ]);

    const result = await this.aggregate(pipeline);
    const baseStats = result[0] || {
      total: 0,
      active: 0,
      outOfStock: 0,
      lowStock: 0,
      featured: 0,
      totalValue: 0
    };

    return {
      ...baseStats,
      byCategory: categoryStats.map(item => ({ category: item._id.toString(), count: item.count })),
      topSelling: topSelling.map(item => ({ product: item.product, totalSold: item.totalSold }))
    };
  }

  async findProductsByTags(tags: string[]): Promise<ProductDocument[]> {
    return this.findMany({
      tags: { $in: tags },
      isActive: true,
      status: 'active'
    }, { sort: { name: 1 } });
  }

  async searchProducts(searchTerm: string, limit: number = 10): Promise<ProductDocument[]> {
    return this.findMany({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { sku: { $regex: searchTerm, $options: 'i' } },
        { barcode: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } }
      ],
      isActive: true,
      status: 'active'
    }, { limit, sort: { rating: -1, totalSold: -1 } });
  }
}
