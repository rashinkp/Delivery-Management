import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../../schemas/product.schema';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [
    {
      provide: 'IProductService',
      useClass: ProductService,
    },
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
  ],
  exports: ['IProductService'],
})
export class ProductModule {}


