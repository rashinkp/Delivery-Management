import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../common/repositories/base.repository';
import { Vendor, VendorDocument } from '../schemas/vendor.schema';
import { PaginationDto } from '../dto/common/pagination.dto';
import { IVendorRepository } from '../common/interfaces/repositories/vendor.repository.interface';

@Injectable()
export class VendorRepository extends BaseRepository<VendorDocument> implements IVendorRepository {
  constructor(@InjectModel(Vendor.name) private readonly vendorModel: Model<VendorDocument>) {
    super(vendorModel);
  }

  // Custom methods specific to Vendor entity
  async findByEmail(email: string): Promise<VendorDocument | null> {
    return this.findOne({ email: email.toLowerCase(), isActive: true });
  }

  async findByMobile(mobile: string): Promise<VendorDocument | null> {
    return this.findOne({ mobile, isActive: true });
  }

  async findByEmailOrMobile(identifier: string): Promise<VendorDocument | null> {
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

  async updateEmailVerificationStatus(id: string, isVerified: boolean): Promise<VendorDocument | null> {
    return this.updateById(id, { isEmailVerified: isVerified });
  }

  async updateMobileVerificationStatus(id: string, isVerified: boolean): Promise<VendorDocument | null> {
    return this.updateById(id, { isMobileVerified: isVerified });
  }

  async updateStatus(id: string, status: string): Promise<VendorDocument | null> {
    return this.updateById(id, { status });
  }

  async findVendorsByLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 10
  ): Promise<VendorDocument[]> {
    const pipeline = [
      {
        $match: {
          isActive: true,
          status: 'active',
          'location.latitude': { $exists: true },
          'location.longitude': { $exists: true }
        }
      },
      {
        $addFields: {
          distance: {
            $multiply: [
              {
                $acos: {
                  $add: [
                    {
                      $multiply: [
                        { $sin: { $multiply: [{ $divide: ['$location.latitude', 180] }, Math.PI] } },
                        { $sin: { $multiply: [{ $divide: [latitude, 180] }, Math.PI] } }
                      ]
                    },
                    {
                      $multiply: [
                        { $cos: { $multiply: [{ $divide: ['$location.latitude', 180] }, Math.PI] } },
                        { $cos: { $multiply: [{ $divide: [latitude, 180] }, Math.PI] } },
                        { $cos: { $multiply: [{ $divide: [{ $subtract: ['$location.longitude', longitude] }, 180] }, Math.PI] } }
                      ]
                    }
                  ]
                }
              },
              6371 // Earth's radius in kilometers
            ]
          }
        }
      },
      {
        $match: {
          distance: { $lte: radiusKm }
        }
      },
      {
        $sort: { distance: 1 }
      }
    ];

    return this.aggregate(pipeline);
  }

  async findVendorsByCity(city: string): Promise<VendorDocument[]> {
    return this.findMany({
      city: { $regex: city, $options: 'i' },
      isActive: true,
      status: 'active'
    });
  }

  async findVendorsByState(state: string): Promise<VendorDocument[]> {
    return this.findMany({
      state: { $regex: state, $options: 'i' },
      isActive: true,
      status: 'active'
    });
  }

  async findVendorsWithPagination(
    pagination: PaginationDto,
    filters?: {
      search?: string;
      city?: string;
      state?: string;
      status?: string;
      isEmailVerified?: boolean;
      isMobileVerified?: boolean;
      isActive?: boolean;
      tags?: string[];
    }
  ): Promise<{
    data: VendorDocument[];
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
          { mobile: { $regex: filters.search, $options: 'i' } },
          { address: { $regex: filters.search, $options: 'i' } },
          { city: { $regex: filters.search, $options: 'i' } },
          { state: { $regex: filters.search, $options: 'i' } }
        ];
      }
      
      if (filters.city) query.city = { $regex: filters.city, $options: 'i' };
      if (filters.state) query.state = { $regex: filters.state, $options: 'i' };
      if (filters.status) query.status = filters.status;
      if (filters.isEmailVerified !== undefined) query.isEmailVerified = filters.isEmailVerified;
      if (filters.isMobileVerified !== undefined) query.isMobileVerified = filters.isMobileVerified;
      if (filters.isActive !== undefined) query.isActive = filters.isActive;
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }
    }

    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    return this.findWithPagination(query, page, limit, sort);
  }

  async getVendorStats(): Promise<{
    total: number;
    active: number;
    emailVerified: number;
    mobileVerified: number;
    byCity: Array<{ city: string; count: number }>;
    byState: Array<{ state: string; count: number }>;
  }> {
    const pipeline = [
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          emailVerified: { $sum: { $cond: [{ $eq: ['$isEmailVerified', true] }, 1, 0] } },
          mobileVerified: { $sum: { $cond: [{ $eq: ['$isMobileVerified', true] }, 1, 0] } }
        }
      }
    ];

    const cityStats = await this.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const stateStats = await this.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$state',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const result = await this.aggregate(pipeline);
    const baseStats = result[0] || {
      total: 0,
      active: 0,
      emailVerified: 0,
      mobileVerified: 0
    };

    return {
      ...baseStats,
      byCity: cityStats.map(item => ({ city: item._id, count: item.count })),
      byState: stateStats.map(item => ({ state: item._id, count: item.count }))
    };
  }

  async findVendorsByTags(tags: string[]): Promise<VendorDocument[]> {
    return this.findMany({
      tags: { $in: tags },
      isActive: true,
      status: 'active'
    });
  }

  // Interface compliance methods
  async findByCity(city: string): Promise<VendorDocument[]> {
    return this.findVendorsByCity(city);
  }

  async findByState(state: string): Promise<VendorDocument[]> {
    return this.findVendorsByState(state);
  }

  async findByStatus(status: string): Promise<VendorDocument[]> {
    return this.findMany({ status, isActive: true });
  }

  async searchVendors(query: string): Promise<VendorDocument[]> {
    return this.findMany({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { mobile: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
        { state: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    });
  }

  async findByLocation(latitude: number, longitude: number, radius: number): Promise<VendorDocument[]> {
    return this.findVendorsByLocation(latitude, longitude, radius);
  }

  async updateLocation(vendorId: string, location: { latitude: number; longitude: number; address: string }): Promise<VendorDocument | null> {
    return this.updateById(vendorId, { location });
  }
}
