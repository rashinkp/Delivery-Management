import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TruckDriver,
  TruckDriverSchema,
} from '../../schemas/truck-driver.schema';
import { TruckDriverController } from './truck-driver.controller';
import { TruckDriverService } from './truck-driver.service';
import { TruckDriverRepository } from './truck-driver.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TruckDriver.name, schema: TruckDriverSchema },
    ]),
  ],
  controllers: [TruckDriverController],
  providers: [
    {
      provide: 'ITruckDriverService',
      useClass: TruckDriverService,
    },
    {
      provide: 'ITruckDriverRepository',
      useClass: TruckDriverRepository,
    },
  ],
  exports: ['ITruckDriverService'],
})
export class TruckDriverModule {}
