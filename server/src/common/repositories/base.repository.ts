import { Injectable } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import { IBaseRepository } from './base.repository.interface';

@Injectable()
export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  constructor(protected readonly model: Model<T>) {}

  async create(entity: Partial<T>): Promise<T> {
    return await this.model.create(entity);
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async update(id: string, updateData: Partial<T>): Promise<T> {
    return this.model
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec() as Promise<T>;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}
