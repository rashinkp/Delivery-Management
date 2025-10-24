import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Admin } from 'src/schemas/admin.schema';
import { IAdminRepository } from './interfaces/admin.repository.interface';

@Injectable()
export class AdminRepository
  extends BaseRepository<Admin>
  implements IAdminRepository
{
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<Admin>,
  ) {
    super(adminModel);
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminModel.findOne({ email }).exec();
  }
}
