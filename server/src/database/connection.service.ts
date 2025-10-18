import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseConnectionService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseConnectionService.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    try {
      await this.connection.asPromise();
      this.logger.log('✅ MongoDB connected successfully');
      this.logger.log(`📊 Database: ${this.connection.name}`);
      this.logger.log(`🔗 Host: ${this.connection.host}:${this.connection.port}`);
    } catch (error) {
      this.logger.error('❌ Failed to connect to MongoDB', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.connection.close();
      this.logger.log('🔌 MongoDB connection closed');
    } catch (error) {
      this.logger.error('❌ Error closing MongoDB connection', error);
    }
  }

  async isConnected(): Promise<boolean> {
    return this.connection.readyState === 1;
  }

  async getConnectionInfo() {
    return {
      name: this.connection.name,
      host: this.connection.host,
      port: this.connection.port,
      readyState: this.connection.readyState,
      isConnected: await this.isConnected(),
    };
  }
}
