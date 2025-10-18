import { OrderDocument } from '../../../schemas/order.schema';
import { BaseRepositoryInterface } from '../../repositories/base.repository.interface';

export interface IOrderRepository extends BaseRepositoryInterface<OrderDocument> {
  // Order-specific methods
  findByOrderNumber(orderNumber: string): Promise<OrderDocument | null>;
  findByTruckDriver(truckDriverId: string): Promise<OrderDocument[]>;
  findByVendor(vendorId: string): Promise<OrderDocument[]>;
  findByStatus(status: string): Promise<OrderDocument[]>;
  findPendingOrders(): Promise<OrderDocument[]>;
  findInProgressOrders(): Promise<OrderDocument[]>;
  findCompletedOrders(): Promise<OrderDocument[]>;
  findUrgentOrders(): Promise<OrderDocument[]>;
  updateStatus(orderId: string, status: string): Promise<OrderDocument | null>;
  updatePaymentInfo(orderId: string, paymentInfo: { method: string; transactionId?: string; paidAt?: Date }): Promise<OrderDocument | null>;
  updateDeliveryInfo(orderId: string, deliveryInfo: { scheduledDate?: Date; deliveredAt?: Date; deliveryAddress?: string; deliveryNotes?: string; deliveryPerson?: string }): Promise<OrderDocument | null>;
  updateLocation(orderId: string, location: { latitude: number; longitude: number; address: string; timestamp: Date }): Promise<OrderDocument | null>;
  findOrdersByDateRange(startDate: Date, endDate: Date): Promise<OrderDocument[]>;
  findOrdersByProduct(productId: string): Promise<OrderDocument[]>;
  getRevenueByDateRange(startDate: Date, endDate: Date): Promise<any>;
  getOrderStats(): Promise<any>;
  generateOrderNumber(): Promise<string>;
  findOrdersWithPagination(pagination: any, filters?: any): Promise<{ data: OrderDocument[]; total: number; page: number; limit: number }>;
}
