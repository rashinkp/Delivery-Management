import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class BaseEntity {
  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;

  @Prop()
  createdBy?: string;

  @Prop()
  updatedBy?: string;
}

export type BaseEntityDocument = BaseEntity & Document;
export const BaseEntitySchema = SchemaFactory.createForClass(BaseEntity);
