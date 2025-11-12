import { Injectable } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import { IBaseRepository } from './base.repository.interface';

@Injectable()
export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  constructor(protected readonly model: Model<T>) {}

  protected hasSoftDeleteFields(): boolean {
    return (
      this.model.schema.path('isDeleted') !== undefined &&
      this.model.schema.path('deletedAt') !== undefined
    );
  }

  async create(entity: Partial<T>): Promise<T> {
    return await this.model.create(entity);
  }

  async findAll(): Promise<T[]> {
    const filter: any = {};
    if (this.hasSoftDeleteFields()) {
      filter.isDeleted = { $ne: true };
    }
    return this.model.find(filter).exec();
  }

  async findById(id: string): Promise<T | null> {
    const filter: any = { _id: id };
    if (this.hasSoftDeleteFields()) {
      filter.isDeleted = { $ne: true };
    }
    return this.model.findOne(filter).exec();
  }

  async findByIdIncludingDeleted(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async update(id: string, updateData: Partial<T>): Promise<T> {
    return this.model
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec() as Promise<T>;
  }

  async delete(id: string): Promise<boolean> {
    if (this.hasSoftDeleteFields()) {
      const result = await this.model
        .findByIdAndUpdate(
          id,
          { isDeleted: true, deletedAt: new Date() } as any,
          { new: true },
        )
        .exec();
      return !!result;
    }

    const hardDeleted = await this.model.findByIdAndDelete(id).exec();
    return !!hardDeleted;
  }

  async restore(id: string): Promise<boolean> {
    if (!this.hasSoftDeleteFields()) {
      return false;
    }
    const result = await this.model
      .findByIdAndUpdate(
        id,
        { isDeleted: false, deletedAt: null } as any,
        { new: true },
      )
      .exec();
    return !!result;
  }
}
