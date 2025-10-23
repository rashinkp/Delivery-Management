import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from './common/logger/logger.service';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(LoggerService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );

  // Enable graceful shutdown
  app.enableShutdownHooks();

  const port = process.env.PORT || 5000;
  await app.listen(port);
  logger.log(`🚀 Application running on http://localhost:${port}`);

  // Graceful shutdown handling
  process.on('SIGINT', async () => {
    logger.log('🛑 Received SIGINT, shutting down gracefully...', 'Application');
    try {
      const connection = app.get<Connection>(getConnectionToken());
      if (connection) {
        await connection.close();
        logger.log('✅ MongoDB connection closed', 'Application');
      }
      await app.close();
      logger.log('✅ Application closed successfully', 'Application');
      process.exit(0);
    } catch (error) {
      logger.error('❌ Error during shutdown', error.message, 'Application');
      process.exit(1);
    }
  });

  process.on('SIGTERM', async () => {
    logger.log('🛑 Received SIGTERM, shutting down gracefully...', 'Application');
    try {
      const connection = app.get<Connection>(getConnectionToken());
      if (connection) {
        await connection.close();
        logger.log('✅ MongoDB connection closed', 'Application');
      }
      await app.close();
      logger.log('✅ Application closed successfully', 'Application');
      process.exit(0);
    } catch (error) {
      logger.error('❌ Error during shutdown', error.message, 'Application');
      process.exit(1);
    }
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('💥 Uncaught Exception', error.message, 'Application');
    logger.error('Stack trace:', error.stack, 'Application');
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('💥 Unhandled Rejection', `Promise: ${promise}, Reason: ${reason}`, 'Application');
    process.exit(1);
  });
}

bootstrap();
