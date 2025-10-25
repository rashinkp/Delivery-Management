import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TruckDriver,
  TruckDriverSchema,
} from '../../schemas/truck-driver.schema';
import { TruckDriverController } from './truck-driver.controller';
import { TruckDriverService } from './truck-driver.service';
import { TruckDriverRepository } from './truck-driver.repository';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../../common/config/jwt.config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TruckDriver.name, schema: TruckDriverSchema },
    ]),
    JwtModule.register({
      ...jwtConfig,
      global: true,
    }),
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
