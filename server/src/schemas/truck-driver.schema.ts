import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from './base.schema';
import { USER_ROLES } from '../common/constants/app-constants';

@Schema({ collection: 'truck_drivers' })
export class TruckDriver extends BaseEntity {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  mobile: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: USER_ROLES.TRUCK_DRIVER })
  role: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ required: true, trim: true })
  drivingLicense: string;

  @Prop({ required: true })
  licenseExpiryDate: Date;

  @Prop({ default: false })
  isMobileVerified: boolean;

  @Prop({ default: false })
  isLicenseValid: boolean;

  @Prop()
  lastLoginAt?: Date;

  @Prop()
  profileImage?: string;

  @Prop({ type: Object })
  vehicleInfo?: {
    vehicleNumber?: string;
    vehicleType?: string;
    capacity?: number;
  };

  @Prop({ type: Object })
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    lastUpdated: Date;
  };

  @Prop({ default: 'available' })
  status: string; // available, busy, offline

  @Prop({ type: Object })
  preferences?: Record<string, any>;
}

export type TruckDriverDocument = TruckDriver & Document;
export const TruckDriverSchema = SchemaFactory.createForClass(TruckDriver);

// Add indexes for better performance
TruckDriverSchema.index({ mobile: 1 });
TruckDriverSchema.index({ drivingLicense: 1 });
TruckDriverSchema.index({ role: 1 });
TruckDriverSchema.index({ status: 1 });
TruckDriverSchema.index({ isActive: 1 });
TruckDriverSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });
