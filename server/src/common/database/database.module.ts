import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri =
          configService.get<string>('MONGODB_URI') ||
          'mongodb://localhost:27017/wholesale_delivery_db';
        console.log('🔄 Connecting to MongoDB:', uri);

        return {
          uri,
          retryAttempts: 5,
          retryDelay: 3000,
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              console.log('✅ MongoDB connected successfully');
              console.log(`📊 Database: ${connection.db.databaseName}`);
            });
            connection.on('error', (error) => {
              console.error('❌ MongoDB connection error:', error);
            });
            connection.on('disconnected', () => {
              console.log('⚠️ MongoDB disconnected');
            });
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
