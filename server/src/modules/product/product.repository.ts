import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../../schemas/product.schema';
import { BaseRepository } from '../../common/repositories/base.repository';
import { IProductRepository } from './interfaces/product.repository.interface';

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
}

