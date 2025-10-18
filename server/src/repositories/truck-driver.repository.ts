import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../common/repositories/base.repository';
import { TruckDriver, TruckDriverDocument } from '../schemas/truck-driver.schema';
import { CreateTruckDriverDto, UpdateTruckDriverDto } from '../dto/truck-driver/truck-driver.dto';
import { PaginationDto } from '../dto/common/pagination.dto';

@Injectable()
export class TruckDriverRepository extends BaseRepository<TruckDriverDocument> {
  constructor(@InjectModel(TruckDriver.name) private readonly truckDriverModel: Model<TruckDriverDocument>) {
    super(truckDriverModel);
  }

  // Custom methods specific to TruckDriver entity
  async findByMobile(mobile: string): Promise<TruckDriverDocument | null> {
    return this.findOne({ mobile, isActive: true });
  }

  async findByDrivingLicense(license: string): Promise<TruckDriverDocument | null> {
    return this.findOne({ drivingLicense: license, isActive: true });
  }

  async checkMobileExists(mobile: string, excludeId?: string): Promise<boolean> {
    const query: any = { mobile };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return this.exists(query);
  }

  async checkLicenseExists(license: string, excludeId?: string): Promise<boolean> {
    const query: any = { drivingLicense: license };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return this.exists(query);
  }

  async updateLastLogin(id: string): Promise<TruckDriverDocument | null> {
    return this.updateById(id, { lastLoginAt: new Date() });
  }

  async updateLocation(id: string, location: {
    latitude: number;
    longitude: number;
    address: string;
  }): Promise<TruckDriverDocument | null> {
    return this.updateById(id, {
      location: {
        ...location,
        lastUpdated: new Date()
      }
    });
  }

  async updateStatus(id: string, status: string): Promise<TruckDriverDocument | null> {
    return this.updateById(id, { status });
  }

  async updateLicenseValidity(id: string, isValid: boolean): Promise<TruckDriverDocument | null> {
    return this.updateById(id, { isLicenseValid: isValid });
  }

  async findAvailableDrivers(): Promise<TruckDriverDocument[]> {
    return this.findMany({
      status: 'available',
      isActive: true,
      isLicenseValid: true
    });
  }

  async findDriversNearLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 10
  ): Promise<TruckDriverDocument[]> {
    const pipeline = [
      {
        $match: {
          isActive: true,
          status: 'available',
          isLicenseValid: true,
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

  async findDriversWithPagination(
    pagination: PaginationDto,
    filters?: {
      search?: string;
      status?: string;
      isLicenseValid?: boolean;
      isMobileVerified?: boolean;
      isActive?: boolean;
      city?: string;
    }
  ): Promise<{
    data: TruckDriverDocument[];
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
          { mobile: { $regex: filters.search, $options: 'i' } },
          { drivingLicense: { $regex: filters.search, $options: 'i' } },
          { address: { $regex: filters.search, $options: 'i' } }
        ];
      }
      
      if (filters.status) query.status = filters.status;
      if (filters.isLicenseValid !== undefined) query.isLicenseValid = filters.isLicenseValid;
      if (filters.isMobileVerified !== undefined) query.isMobileVerified = filters.isMobileVerified;
      if (filters.isActive !== undefined) query.isActive = filters.isActive;
      if (filters.city) query['address'] = { $regex: filters.city, $options: 'i' };
    }

    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    return this.findWithPagination(query, page, limit, sort);
  }

  async getDriverStats(): Promise<{
    total: number;
    active: number;
    available: number;
    busy: number;
    offline: number;
    licenseValid: number;
    mobileVerified: number;
  }> {
    const pipeline = [
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          available: { $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] } },
          busy: { $sum: { $cond: [{ $eq: ['$status', 'busy'] }, 1, 0] } },
          offline: { $sum: { $cond: [{ $eq: ['$status', 'offline'] }, 1, 0] } },
          licenseValid: { $sum: { $cond: [{ $eq: ['$isLicenseValid', true] }, 1, 0] } },
          mobileVerified: { $sum: { $cond: [{ $eq: ['$isMobileVerified', true] }, 1, 0] } }
        }
      }
    ];

    const result = await this.aggregate(pipeline);
    return result[0] || {
      total: 0,
      active: 0,
      available: 0,
      busy: 0,
      offline: 0,
      licenseValid: 0,
      mobileVerified: 0
    };
  }

  async findDriversWithExpiringLicenses(daysBeforeExpiry: number = 30): Promise<TruckDriverDocument[]> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysBeforeExpiry);

    return this.findMany({
      isActive: true,
      licenseExpiryDate: { $lte: expiryDate }
    });
  }
}
