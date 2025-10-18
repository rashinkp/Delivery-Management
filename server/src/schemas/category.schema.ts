import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from './base.schema';

@Schema({ collection: 'categories' })
export class Category extends BaseEntity {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description?: string;

  @Prop()
  image?: string;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: 'active' })
  status: string; // active, inactive

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop()
  parentCategory?: string; // Reference to parent category for hierarchical structure
}

export type CategoryDocument = Category & Document;
export const CategorySchema = SchemaFactory.createForClass(Category);

// Add indexes for better performance
CategorySchema.index({ name: 1 });
CategorySchema.index({ status: 1 });
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ sortOrder: 1 });
CategorySchema.index({ parentCategory: 1 });
CategorySchema.index({ tags: 1 });
