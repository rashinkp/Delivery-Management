import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from './base.schema';

@Schema({ collection: 'vendors' })
export class Vendor extends BaseEntity {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, unique: true, trim: true })
  mobile: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ required: true, trim: true })
  state: string;

  @Prop({ required: true, trim: true })
  pincode: string;

  @Prop({ 
    required: true,
    type: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String, required: true }
    }
  })
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: false })
  isMobileVerified: boolean;

  @Prop()
  profileImage?: string;

  @Prop({ type: Object })
  businessInfo?: {
    gstNumber?: string;
    panNumber?: string;
    businessType?: string;
    registrationDate?: Date;
  };

  @Prop({ type: Object })
  contactInfo?: {
    alternateMobile?: string;
    alternateEmail?: string;
    emergencyContact?: string;
  };

  @Prop({ default: 'active' })
  status: string; // active, inactive, suspended

  @Prop({ type: Object })
  preferences?: Record<string, any>;

  @Prop({ type: [String], default: [] })
  tags?: string[];
}

export type VendorDocument = Vendor & Document;
export const VendorSchema = SchemaFactory.createForClass(Vendor);

// Add indexes for better performance (only for non-unique fields)
VendorSchema.index({ city: 1, state: 1 });
VendorSchema.index({ status: 1 });
VendorSchema.index({ isActive: 1 });
VendorSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });
VendorSchema.index({ tags: 1 });
