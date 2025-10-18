import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseEntity } from './base.schema';

@Schema({ collection: 'products' })
export class Product extends BaseEntity {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Category' })
  category: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0 })
  costPrice: number;

  @Prop({ required: true, min: 0 })
  stock: number;

  @Prop({ required: true, min: 0 })
  minStock: number;

  @Prop({ required: true, min: 0 })
  maxStock: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: 'active' })
  status: string; // active, inactive, out_of_stock

  @Prop({ type: Object })
  specifications?: Record<string, any>;

  @Prop({ type: Object })
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
    unit?: string;
  };

  @Prop({ type: Object })
  pricing?: {
    basePrice: number;
    discountPrice?: number;
    taxRate?: number;
    margin?: number;
  };

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ default: 0 })
  totalSold: number;

  @Prop({ default: 0 })
  totalRevenue: number;

  @Prop()
  sku?: string; // Stock Keeping Unit

  @Prop()
  barcode?: string;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviewCount: number;
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);

// Add indexes for better performance
ProductSchema.index({ name: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ stock: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ barcode: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ totalSold: -1 });
