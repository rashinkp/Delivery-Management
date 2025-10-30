// src/orders/dto/order-response.dto.ts
import { Expose, Type } from 'class-transformer';

class OrderProductResponseDto {
  @Expose()
  productId: string;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  quantity: number;
}

class DriverResponseDto {
  @Expose()
  driverId: string;

  @Expose()
  name: string;

  @Expose()
  mobile: string;
}

class VendorResponseDto {
  @Expose()
  vendorId: string;

  @Expose()
  name: string;

  @Expose()
  location: string;

  @Expose()
  contactNumber: string;
}

export class OrderResponseDto {
  @Expose()
  orderId: string;

  @Expose()
  orderNumber: string;

  @Expose()
  @Type(() => DriverResponseDto)
  driver: DriverResponseDto;

  @Expose()
  @Type(() => VendorResponseDto)
  vendor: VendorResponseDto;

  @Expose()
  @Type(() => OrderProductResponseDto)
  products: OrderProductResponseDto[];

  @Expose()
  totalAmount: number;

  @Expose()
  collectedAmount: number;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(order: any) {
    this.orderId = order._id?.toString() || order.id?.toString();
    this.orderNumber = order.orderNumber;
    this.status = order.orderStatus || 'pending';

    // Driver
    this.driver = {
      driverId: order.driverId?._id?.toString() || order.driverId,
      name: order.driverId?.name,
      mobile: order.driverId?.mobile,
    };

    // Vendor
    this.vendor = {
      vendorId: order.vendorId?._id?.toString() || order.vendorId,
      name: order.vendorId?.name,
      location: order.vendorId?.location,
      contactNumber: order.vendorId?.contactNumber,
    };

    // Products
    this.products =
      order.products?.map((item: any) => ({
        productId: item.productId?._id?.toString() || item.productId,
        name: item.productId?.name,
        price: item.productId?.price,
        quantity: item.quantity,
      })) || [];

    // Calculate total
    this.totalAmount = this.products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0,
    );

    this.collectedAmount = order.collectedAmount ?? 0;

    this.createdAt = order.createdAt;
    this.updatedAt = order.updatedAt;
  }
}
