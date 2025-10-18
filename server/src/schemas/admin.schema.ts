import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity, BaseEntitySchema } from './base.schema';
import { USER_ROLES } from '../common/constants/app-constants';

@Schema({ collection: 'admins' })
export class Admin extends BaseEntity {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, unique: true, trim: true })
  mobile: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: USER_ROLES.ADMIN })
  role: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: false })
  isMobileVerified: boolean;

  @Prop()
  lastLoginAt?: Date;

  @Prop()
  profileImage?: string;

  @Prop({ type: Object })
  preferences?: Record<string, any>;
}

export type AdminDocument = Admin & Document;
export const AdminSchema = SchemaFactory.createForClass(Admin);

// Add indexes for better performance (only for non-unique fields)
AdminSchema.index({ role: 1 });
AdminSchema.index({ isActive: 1 });
