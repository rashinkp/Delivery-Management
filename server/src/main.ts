import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from './common/logger/logger.service';
import { RequestLoggerMiddleware } from './common/logger/request-logger.middleware';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // 🍪 Cookie parser for JWT cookies
  app.use(cookieParser());

  // 🔒 Enable CORS for frontend communication with cookies
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  });

  // 🧾 Use your custom logger
  const logger = app.get(LoggerService);

  // 📝 Request logging middleware
  app.use(
    new RequestLoggerMiddleware(logger).use.bind(
      new RequestLoggerMiddleware(logger),
    ),
  );

  // 📦 Global request validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unrecognized fields
      forbidNonWhitelisted: true, // throws error for unwanted props
      transform: true, // auto-transforms to DTO types
    }),
  );

  // 🌍 Prefix all routes with /api (optional but clean)
  app.setGlobalPrefix('api');

  // 🚦 Enable graceful shutdown (for Docker / PM2)
  app.enableShutdownHooks();

  const port = process.env.PORT || 5000;
  await app.listen(port);
  logger.log(
    `🚀 Application running on http://localhost:${port}`,
    'Application',
  );

  // 🧹 Graceful shutdown handler
  async function gracefulShutdown(signal: string) {
    logger.log(
      `🛑 Received ${signal}, shutting down gracefully...`,
      'Application',
    );
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
      logger.error(
        `❌ Error during ${signal} shutdown`,
        error.message,
        'Application',
      );
      process.exit(1);
    }
  }

  ['SIGINT', 'SIGTERM'].forEach((signal) =>
    process.on(signal, () => gracefulShutdown(signal)),
  );

  // ⚠️ Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('💥 Uncaught Exception', error.message, 'Application');
    logger.error('Stack trace:', error.stack, 'Application');
    process.exit(1);
  });

  // ⚠️ Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error(
      '💥 Unhandled Rejection',
      `Promise: ${promise}, Reason: ${reason}`,
      'Application',
    );
    process.exit(1);
  });
}

bootstrap();
