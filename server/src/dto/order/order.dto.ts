import { IsString, MinLength, MaxLength, IsOptional, IsBoolean, IsNumber, Min, IsArray, IsObject, IsMongoId, IsDateString } from 'class-validator';
import { ORDER_STATUS } from '../../common/constants/app-constants';

export class CreateOrderDto {
  @IsMongoId()
  truckDriver: string;

  @IsMongoId()
  vendor: string;

  @IsArray()
  @IsObject({ each: true })
  products: {
    product: string;
    quantity: number;
    unitPrice: number;
  }[];

  @IsNumber()
  @Min(0)
  totalBillAmount: number;

  @IsNumber()
  @Min(0)
  collectedAmount: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: {
    adminNotes?: string;
    driverNotes?: string;
    vendorNotes?: string;
  };

  @IsOptional()
  @IsObject()
  deliveryInfo?: {
    scheduledDate?: string;
    deliveryAddress?: string;
    deliveryNotes?: string;
  };

  @IsOptional()
  @IsObject()
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsDateString()
  expectedDeliveryDate?: string;

  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsObject()
  discounts?: {
    type: string;
    value: number;
    reason?: string;
  };

  @IsOptional()
  @IsObject()
  taxes?: {
    cgst?: number;
    sgst?: number;
    igst?: number;
    totalTax?: number;
  };
}

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  collectedAmount?: number;

  @IsOptional()
  @IsObject()
  paymentInfo?: {
    method: string;
    transactionId?: string;
    paidAt?: string;
  };

  @IsOptional()
  @IsObject()
  deliveryInfo?: {
    scheduledDate?: string;
    deliveredAt?: string;
    deliveryAddress?: string;
    deliveryNotes?: string;
    deliveryPerson?: string;
  };

  @IsOptional()
  @IsObject()
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };

  @IsOptional()
  @IsObject()
  notes?: {
    adminNotes?: string;
    driverNotes?: string;
    vendorNotes?: string;
  };

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsDateString()
  expectedDeliveryDate?: string;

  @IsOptional()
  @IsDateString()
  actualDeliveryDate?: string;

  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class OrderResponseDto {
  id: string;
  orderNumber: string;
  truckDriver: {
    id: string;
    name: string;
    mobile: string;
  };
  vendor: {
    id: string;
    name: string;
    mobile: string;
    address: string;
  };
  products: {
    product: {
      id: string;
      name: string;
      price: number;
    };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  totalBillAmount: number;
  collectedAmount: number;
  pendingAmount: number;
  status: string;
  paymentInfo?: {
    method: string;
    transactionId?: string;
    paidAt?: Date;
  };
  deliveryInfo?: {
    scheduledDate?: Date;
    deliveredAt?: Date;
    deliveryAddress?: string;
    deliveryNotes?: string;
    deliveryPerson?: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    timestamp: Date;
  };
  notes?: {
    adminNotes?: string;
    driverNotes?: string;
    vendorNotes?: string;
  };
  metadata?: Record<string, any>;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  isUrgent: boolean;
  tags?: string[];
  discounts?: {
    type: string;
    value: number;
    reason?: string;
  };
  taxes?: {
    cgst?: number;
    sgst?: number;
    igst?: number;
    totalTax?: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
