import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './common/logger/logger.module';
import { DatabaseModule } from './common/database/database.module';
import { TruckDriverModule } from './modules/truck-driver/truck-driver.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { AdminModule } from './modules/admin/admin.module';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    DatabaseModule,
    TruckDriverModule,
    VendorModule,
    ProductModule,
    OrderModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
