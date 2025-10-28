import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../../schemas/product.schema';
import { BaseRepository } from '../../common/repositories/base.repository';
import { IProductRepository } from './interfaces/product.repository.interface';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductRepository extends BaseRepository<Product> implements IProductRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {
    super(productModel);
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.productModel.find({ category }).exec();
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    return this.productModel.find({ 
      price: { $gte: minPrice, $lte: maxPrice } 
    }).exec();
  }

  async findLowStock(threshold: number): Promise<Product[]> {
    return this.productModel.find({ 
      stock: { $lte: threshold } 
    }).exec();
  }

  async findWithPagination(query: ProductQueryDto): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const { page = 1, limit = 10, category, minPrice, maxPrice, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const filter: any = {};
    if (category) filter.category = category;
    if (typeof minPrice === 'number' || typeof maxPrice === 'number') {
      filter.price = {};
      if (typeof minPrice === 'number') filter.price.$gte = minPrice;
      if (typeof maxPrice === 'number') filter.price.$lte = maxPrice;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      this.productModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return { data, total, page, limit, totalPages, hasNext, hasPrev };
  }
}


