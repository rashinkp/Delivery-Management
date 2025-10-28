import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'TruckDriver', required: true })
  driverId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    required: true,
  })
  products: Array<{
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }>;

  @Prop({ required: true })
  totalBill: number;

  @Prop({ required: true })
  collectedAmount: number;

  @Prop({
    type: String,
    enum: ['pending', 'delivered'],
    default: 'pending',
  })
  orderStatus: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
