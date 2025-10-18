import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { TruckDriverController } from './truck-driver.controller';
import { VendorController } from './vendor.controller';
import { CategoryController } from './category.controller';
import { ProductController } from './product.controller';
import { OrderController } from './order.controller';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [
    AdminController,
    TruckDriverController,
    VendorController,
    CategoryController,
    ProductController,
    OrderController,
  ],
})
export class ControllersModule {}
