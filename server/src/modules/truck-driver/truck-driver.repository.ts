import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TruckDriver } from '../../schemas/truck-driver.schema';
import { BaseRepository } from '../../common/repositories/base.repository';
import { ITruckDriverRepository } from './interfaces/truck-driver.repository.interface';

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
}
