import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseConnectionService } from './database/connection.service';
import { ResponseUtil } from './common/utils/response.util';
import type { ApiResponse } from './common/interfaces/api-response.interface';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dbConnection: DatabaseConnectionService,
  ) {}

  @Get()
  getHello(): ApiResponse<string> {
    const message = this.appService.getHello();
    return ResponseUtil.success(message, 'Welcome to Wholesale Delivery Management System');
  }

  @Get('status')
  getStatus(): ApiResponse<any> {
    const status = this.appService.getStatus();
    return ResponseUtil.success(status, 'Application status retrieved successfully');
  }

  @Get('health')
  async getHealth(): Promise<ApiResponse<any>> {
    const isDbConnected = await this.dbConnection.isConnected();
    const dbInfo = await this.dbConnection.getConnectionInfo();
    
    const health = {
      status: isDbConnected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        connected: isDbConnected,
        ...dbInfo,
      },
      environment: process.env.NODE_ENV || 'development',
    };

    return ResponseUtil.success(health, 'Health check completed');
  }
}
