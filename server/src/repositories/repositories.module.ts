import { Module } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { TruckDriverRepository } from './truck-driver.repository';
import { VendorRepository } from './vendor.repository';
import { CategoryRepository } from './category.repository';
import { ProductRepository } from './product.repository';
import { OrderRepository } from './order.repository';
import { SchemasModule } from '../schemas/schemas.module';

@Module({
  imports: [SchemasModule],
  providers: [
    AdminRepository,
    TruckDriverRepository,
    VendorRepository,
    CategoryRepository,
    ProductRepository,
    OrderRepository,
  ],
  exports: [
    AdminRepository,
    TruckDriverRepository,
    VendorRepository,
    CategoryRepository,
    ProductRepository,
    OrderRepository,
  ],
})
export class RepositoriesModule {}
