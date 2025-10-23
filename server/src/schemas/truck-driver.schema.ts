import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class TruckDriver extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  mobile: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  licenseNumber: string;

  @Prop({ required: true })
  password: string;

  @Prop({ 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active' 
  })
  status: string;
}

export const TruckDriverSchema = SchemaFactory.createForClass(TruckDriver);
