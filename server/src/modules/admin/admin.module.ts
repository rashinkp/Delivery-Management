import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin, AdminSchema } from 'src/schemas/admin.schema';
import { AdminRepository } from './admin.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    {
      provide: 'IAdminRepository',
      useClass: AdminRepository,
    },
    {
      provide: 'IAdminService',
      useClass: AdminService,
    },
  ],
  exports: [AdminService],
})
export class AdminModule {}
