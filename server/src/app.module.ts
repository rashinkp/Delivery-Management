import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from './common/logger/logger.service';
import { DatabaseModule } from './database/database.module';
import { DatabaseConnectionService } from './database/connection.service';
import { SchemasModule } from './schemas/schemas.module';
import { RepositoriesModule } from './repositories/repositories.module';
import { ServicesModule } from './services/services.module';
import { ControllersModule } from './controllers/controllers.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig, jwtConfig],
    }),
    DatabaseModule,
    SchemasModule,
    RepositoriesModule,
    ServicesModule,
    AuthModule,
    ControllersModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService, DatabaseConnectionService],
  exports: [LoggerService, DatabaseConnectionService, SchemasModule, RepositoriesModule, ServicesModule],
})
export class AppModule {}
