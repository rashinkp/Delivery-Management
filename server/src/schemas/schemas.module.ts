import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './admin.schema';
import { TruckDriver, TruckDriverSchema } from './truck-driver.schema';
import { Vendor, VendorSchema } from './vendor.schema';
import { Category, CategorySchema } from './category.schema';
import { Product, ProductSchema } from './product.schema';
import { Order, OrderSchema } from './order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: TruckDriver.name, schema: TruckDriverSchema },
      { name: Vendor.name, schema: VendorSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class SchemasModule {}
