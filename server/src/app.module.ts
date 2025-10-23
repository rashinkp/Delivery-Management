import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './common/logger/logger.module';
import { DatabaseModule } from './common/database/database.module';
import { TruckDriverModule } from './modules/truck-driver/truck-driver.module';
import { VendorModule } from './modules/vendor/vendor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    DatabaseModule,
    TruckDriverModule,
    VendorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
