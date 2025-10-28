import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Vendor } from 'src/schemas/vendor.schema';
import { IVendorRepository } from './interfaces/vendor.repository.interface';
import { VendorQueryDto } from './dto/vendor-query.dto';

@Injectable()
export class VendorRepository extends BaseRepository<Vendor> implements IVendorRepository {
  constructor(
    @InjectModel(Vendor.name)
    private readonly vendorModel: Model<Vendor>,
  ) {
    super(vendorModel);
  }

  async findByEmail(email: string): Promise<Vendor | null> {
    return this.vendorModel.findOne({ email }).exec();
  }

  async findByContactNumber(contactNumber: string): Promise<Vendor | null> {
    return this.vendorModel.findOne({ contactNumber }).exec();
  }

  async findByLocation(location: string): Promise<Vendor[]> {
    return this.vendorModel.find({ location }).exec();
  }

  async findWithPagination(query: VendorQueryDto): Promise<{
    data: Vendor[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const { page = 1, limit = 10, search, location, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const filter: any = {};
    if (location) {
      filter.location = location;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { contactNumber: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    // Add a stable tiebreaker to avoid duplicate items across pages when values are equal
    if (sortBy !== '_id') {
      sort._id = sort[sortBy];
    }

    const [data, total] = await Promise.all([
      this.vendorModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.vendorModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return { data, total, page, limit, totalPages, hasNext, hasPrev };
  }
}
