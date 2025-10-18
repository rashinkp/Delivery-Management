import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { TruckDriverService } from './truck-driver.service';
import { VendorService } from './vendor.service';
import { CategoryService } from './category.service';
import { ProductService } from './product.service';
import { OrderService } from './order.service';
import { RepositoriesModule } from '../repositories/repositories.module';

@Module({
  imports: [RepositoriesModule],
  providers: [
    AdminService,
    TruckDriverService,
    VendorService,
    CategoryService,
    ProductService,
    OrderService,
  ],
  exports: [
    AdminService,
    TruckDriverService,
    VendorService,
    CategoryService,
    ProductService,
    OrderService,
  ],
})
export class ServicesModule {}
