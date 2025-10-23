import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Vendor } from 'src/schemas/vendor.schema';
import { IVendorRepository } from './interfaces/vendor.repository.interface';

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
}
