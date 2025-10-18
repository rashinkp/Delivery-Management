import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../common/repositories/base.repository';
import { Admin, AdminDocument } from '../schemas/admin.schema';
import { CreateAdminDto, UpdateAdminDto } from '../dto/admin/admin.dto';
import { PaginationDto } from '../dto/common/pagination.dto';
import { NotFoundException, ConflictException } from '../common/exceptions/custom.exceptions';
import { IAdminRepository } from '../common/interfaces/repositories/admin.repository.interface';

@Injectable()
export class AdminRepository extends BaseRepository<AdminDocument> implements IAdminRepository {
  constructor(@InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>) {
    super(adminModel);
  }

  // Custom methods specific to Admin entity
  async findByEmail(email: string): Promise<AdminDocument | null> {
    return this.findOne({ email: email.toLowerCase(), isActive: true });
  }

  async findByMobile(mobile: string): Promise<AdminDocument | null> {
    return this.findOne({ mobile, isActive: true });
  }

  async findByEmailOrMobile(identifier: string): Promise<AdminDocument | null> {
    const query = {
      $or: [
        { email: identifier.toLowerCase() },
        { mobile: identifier }
      ],
      isActive: true
    };
    return this.findOne(query);
  }

  async checkEmailExists(email: string, excludeId?: string): Promise<boolean> {
    const query: any = { email: email.toLowerCase() };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return this.exists(query);
  }

  async checkMobileExists(mobile: string, excludeId?: string): Promise<boolean> {
    const query: any = { mobile };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return this.exists(query);
  }

  async updateLastLogin(id: string): Promise<AdminDocument | null> {
    return this.updateById(id, { lastLoginAt: new Date() });
  }

  async updateEmailVerificationStatus(id: string, isVerified: boolean): Promise<AdminDocument | null> {
    return this.updateById(id, { isEmailVerified: isVerified });
  }

  async updateMobileVerificationStatus(id: string, isVerified: boolean): Promise<AdminDocument | null> {
    return this.updateById(id, { isMobileVerified: isVerified });
  }

  async findAdminsWithPagination(
    pagination: PaginationDto,
    filters?: {
      search?: string;
      role?: string;
      isEmailVerified?: boolean;
      isMobileVerified?: boolean;
      isActive?: boolean;
    }
  ): Promise<{
    data: AdminDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    
    let query: any = {};
    
    // Apply filters
    if (filters) {
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { email: { $regex: filters.search, $options: 'i' } },
          { mobile: { $regex: filters.search, $options: 'i' } }
        ];
      }
      
      if (filters.role) query.role = filters.role;
      if (filters.isEmailVerified !== undefined) query.isEmailVerified = filters.isEmailVerified;
      if (filters.isMobileVerified !== undefined) query.isMobileVerified = filters.isMobileVerified;
      if (filters.isActive !== undefined) query.isActive = filters.isActive;
    }

    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    return this.findWithPagination(query, page, limit, sort);
  }

  async getAdminStats(): Promise<{
    total: number;
    active: number;
    emailVerified: number;
    mobileVerified: number;
    recentLogins: number;
  }> {
    const pipeline = [
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          emailVerified: { $sum: { $cond: [{ $eq: ['$isEmailVerified', true] }, 1, 0] } },
          mobileVerified: { $sum: { $cond: [{ $eq: ['$isMobileVerified', true] }, 1, 0] } },
          recentLogins: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    '$lastLoginAt',
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ];

    const result = await this.aggregate(pipeline);
    return result[0] || {
      total: 0,
      active: 0,
      emailVerified: 0,
      mobileVerified: 0,
      recentLogins: 0
    };
  }

  // Interface compliance methods
  async findByMobileNumber(mobileNumber: string): Promise<AdminDocument | null> {
    return this.findByMobile(mobileNumber);
  }

  async checkMobileNumberExists(mobileNumber: string, excludeId?: string): Promise<boolean> {
    return this.checkMobileExists(mobileNumber, excludeId);
  }

  async findByRole(role: string): Promise<AdminDocument[]> {
    return this.findMany({ role, isActive: true }, { sort: { name: 1 } });
  }

  async getActiveAdmins(): Promise<AdminDocument[]> {
    return this.findMany({ isActive: true }, { sort: { name: 1 } });
  }
}
