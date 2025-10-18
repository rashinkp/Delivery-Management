import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseEntity } from './base.schema';
import { ORDER_STATUS } from '../common/constants/app-constants';

@Schema({ collection: 'orders' })
export class Order extends BaseEntity {
  @Prop({ required: true, unique: true, trim: true })
  orderNumber: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'TruckDriver' })
  truckDriver: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Vendor' })
  vendor: Types.ObjectId;

  @Prop({ 
    required: true, 
    type: [{
      product: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      totalPrice: { type: Number, required: true }
    }]
  })
  products: {
    product: Types.ObjectId;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];

  @Prop({ required: true, min: 0 })
  totalBillAmount: number;

  @Prop({ required: true, min: 0 })
  collectedAmount: number;

  @Prop({ min: 0, default: 0 })
  pendingAmount: number;

  @Prop({ required: true, default: ORDER_STATUS.PENDING })
  status: string;

  @Prop({ type: Object })
  paymentInfo?: {
    method: string; // cash, card, upi, etc.
    transactionId?: string;
    paidAt?: Date;
  };

  @Prop({ type: Object })
  deliveryInfo?: {
    scheduledDate?: Date;
    deliveredAt?: Date;
    deliveryAddress?: string;
    deliveryNotes?: string;
    deliveryPerson?: string;
  };

  @Prop({ 
    type: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String, required: true },
      timestamp: { type: Date, required: true }
    }
  })
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    timestamp: Date;
  };

  @Prop({ type: Object })
  notes?: {
    adminNotes?: string;
    driverNotes?: string;
    vendorNotes?: string;
  };

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop()
  orderDate: Date;

  @Prop()
  expectedDeliveryDate?: Date;

  @Prop()
  actualDeliveryDate?: Date;

  @Prop({ default: false })
  isUrgent: boolean;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ type: Object })
  discounts?: {
    type: string; // percentage, fixed
    value: number;
    reason?: string;
  };

  @Prop({ type: Object })
  taxes?: {
    cgst?: number;
    sgst?: number;
    igst?: number;
    totalTax?: number;
  };
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);

// Add indexes for better performance (only for non-unique fields)
OrderSchema.index({ truckDriver: 1 });
OrderSchema.index({ vendor: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ isActive: 1 });
OrderSchema.index({ orderDate: -1 });
OrderSchema.index({ expectedDeliveryDate: 1 });
OrderSchema.index({ actualDeliveryDate: 1 });
OrderSchema.index({ isUrgent: 1 });
OrderSchema.index({ tags: 1 });
OrderSchema.index({ 'products.product': 1 });
OrderSchema.index({ totalBillAmount: 1 });
OrderSchema.index({ collectedAmount: 1 });
