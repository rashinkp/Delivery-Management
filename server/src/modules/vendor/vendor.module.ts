import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vendor, VendorSchema } from '../../schemas/vendor.schema';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { VendorRepository } from './vendor.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }]),
  ],
  controllers: [VendorController],
  providers: [
    {
      provide: 'IVendorService',
      useClass: VendorService,
    },
    {
      provide: 'IVendorRepository',
      useClass: VendorRepository,
    },
  ],
  exports: ['IVendorService'],
})
export class VendorModule {}
