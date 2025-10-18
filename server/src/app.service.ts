import { Injectable } from '@nestjs/common';
import { LoggerService } from './common/logger/logger.service';

@Injectable()
export class AppService {
  constructor(private readonly logger: LoggerService) {}

  getHello(): string {
    this.logger.log('Hello endpoint accessed', 'AppService');
    return 'Welcome to Wholesale Delivery Management System API!';
  }

  getStatus() {
    this.logger.log('Status endpoint accessed', 'AppService');
    return {
      name: 'Wholesale Delivery Management System',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
