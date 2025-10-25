// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AdminModule } from '../admin/admin.module';
import { TruckDriverModule } from '../truck-driver/truck-driver.module';

@Module({
  imports: [AdminModule, TruckDriverModule],
  controllers: [AuthController],
})
export class AuthModule {}
