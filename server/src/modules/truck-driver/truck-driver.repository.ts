import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TruckDriver } from '../../schemas/truck-driver.schema';
import { BaseRepository } from '../../common/repositories/base.repository';
import { ITruckDriverRepository } from './interfaces/truck-driver.repository.interface';
import { TruckDriverQueryDto } from './dto/truck-driver-query.dto';

@Injectable()
export class TruckDriverRepository
  extends BaseRepository<TruckDriver>
  implements ITruckDriverRepository
{
  constructor(
    @InjectModel(TruckDriver.name)
    private readonly driverModel: Model<TruckDriver>,
  ) {
    super(driverModel);
  }

  async findByMobile(mobile: string): Promise<TruckDriver | null> {
    return this.driverModel.findOne({ mobile }).exec();
  }

  async findByLicenseNumber(
    licenseNumber: string,
  ): Promise<TruckDriver | null> {
    return this.driverModel.findOne({ licenseNumber }).exec();
  }

  async findByStatus(status: string): Promise<TruckDriver[]> {
    return this.driverModel.find({ status }).exec();
  }

  async findWithPagination(query: TruckDriverQueryDto): Promise<{
    data: TruckDriver[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Build filter object
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { licenseNumber: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries
    const [data, total] = await Promise.all([
      this.driverModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.driverModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
    };
  }
}
