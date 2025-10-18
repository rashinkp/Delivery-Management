import { Injectable, Logger } from '@nestjs/common';
import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { BaseRepositoryInterface } from './base.repository.interface';

@Injectable()
export abstract class BaseRepository<T extends Document> implements BaseRepositoryInterface<T> {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(protected readonly model: Model<T>) {}

  // Create operations
  async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      const saved = await document.save();
      this.logger.debug(`Created ${this.model.modelName}`, { id: saved._id });
      return saved;
    } catch (error) {
      this.logger.error(`Error creating ${this.model.modelName}`, error);
      throw error;
    }
  }

  async createMany(data: Partial<T>[]): Promise<T[]> {
    try {
      const documents = await this.model.insertMany(data);
      this.logger.debug(`Created ${documents.length} ${this.model.modelName} documents`);
      return documents as unknown as T[];
    } catch (error) {
      this.logger.error(`Error creating multiple ${this.model.modelName}`, error);
      throw error;
    }
  }

  // Read operations
  async findById(id: string): Promise<T | null> {
    try {
      const document = await this.model.findById(id).exec();
      return document;
    } catch (error) {
      this.logger.error(`Error finding ${this.model.modelName} by id: ${id}`, error);
      throw error;
    }
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      const document = await this.model.findOne(filter).exec();
      return document;
    } catch (error) {
      this.logger.error(`Error finding ${this.model.modelName}`, error);
      throw error;
    }
  }

  async findMany(filter: FilterQuery<T>, options?: QueryOptions): Promise<T[]> {
    try {
      const documents = await this.model.find(filter, null, options).exec();
      return documents;
    } catch (error) {
      this.logger.error(`Error finding multiple ${this.model.modelName}`, error);
      throw error;
    }
  }

  async findAll(options?: QueryOptions): Promise<T[]> {
    try {
      const documents = await this.model.find({}, null, options).exec();
      return documents;
    } catch (error) {
      this.logger.error(`Error finding all ${this.model.modelName}`, error);
      throw error;
    }
  }

  async count(filter?: FilterQuery<T>): Promise<number> {
    try {
      const count = await this.model.countDocuments(filter || {}).exec();
      return count;
    } catch (error) {
      this.logger.error(`Error counting ${this.model.modelName}`, error);
      throw error;
    }
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    try {
      const count = await this.model.countDocuments(filter).exec();
      return count > 0;
    } catch (error) {
      this.logger.error(`Error checking existence of ${this.model.modelName}`, error);
      throw error;
    }
  }

  // Update operations
  async updateById(id: string, data: UpdateQuery<T>): Promise<T | null> {
    try {
      const document = await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
      if (document) {
        this.logger.debug(`Updated ${this.model.modelName}`, { id });
      }
      return document;
    } catch (error) {
      this.logger.error(`Error updating ${this.model.modelName} by id: ${id}`, error);
      throw error;
    }
  }

  async updateOne(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null> {
    try {
      const document = await this.model.findOneAndUpdate(filter, data, { new: true }).exec();
      if (document) {
        this.logger.debug(`Updated ${this.model.modelName}`, { filter });
      }
      return document;
    } catch (error) {
      this.logger.error(`Error updating ${this.model.modelName}`, error);
      throw error;
    }
  }

  async updateMany(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<number> {
    try {
      const result = await this.model.updateMany(filter, data).exec();
      this.logger.debug(`Updated ${result.modifiedCount} ${this.model.modelName} documents`);
      return result.modifiedCount;
    } catch (error) {
      this.logger.error(`Error updating multiple ${this.model.modelName}`, error);
      throw error;
    }
  }

  // Delete operations
  async deleteById(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      if (result) {
        this.logger.debug(`Deleted ${this.model.modelName}`, { id });
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(`Error deleting ${this.model.modelName} by id: ${id}`, error);
      throw error;
    }
  }

  async deleteOne(filter: FilterQuery<T>): Promise<boolean> {
    try {
      const result = await this.model.findOneAndDelete(filter).exec();
      if (result) {
        this.logger.debug(`Deleted ${this.model.modelName}`, { filter });
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(`Error deleting ${this.model.modelName}`, error);
      throw error;
    }
  }

  async deleteMany(filter: FilterQuery<T>): Promise<number> {
    try {
      const result = await this.model.deleteMany(filter).exec();
      this.logger.debug(`Deleted ${result.deletedCount} ${this.model.modelName} documents`);
      return result.deletedCount;
    } catch (error) {
      this.logger.error(`Error deleting multiple ${this.model.modelName}`, error);
      throw error;
    }
  }

  // Pagination
  async findWithPagination(
    filter: FilterQuery<T>,
    page: number,
    limit: number,
    sort?: Record<string, 1 | -1>,
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.model.find(filter).sort(sort).skip(skip).limit(limit).exec(),
        this.model.countDocuments(filter).exec(),
      ]);

      const totalPages = Math.ceil(total / limit);

      this.logger.debug(`Paginated ${this.model.modelName}`, {
        page,
        limit,
        total,
        totalPages,
      });

      return {
        data,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      this.logger.error(`Error paginating ${this.model.modelName}`, error);
      throw error;
    }
  }

  // Aggregation
  async aggregate(pipeline: any[]): Promise<any[]> {
    try {
      const result = await this.model.aggregate(pipeline).exec();
      this.logger.debug(`Aggregated ${this.model.modelName}`, { pipelineLength: pipeline.length });
      return result;
    } catch (error) {
      this.logger.error(`Error aggregating ${this.model.modelName}`, error);
      throw error;
    }
  }
}
