import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Vendor extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  contactNumber: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  address: string;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
