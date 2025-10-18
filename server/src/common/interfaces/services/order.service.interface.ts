import { CreateOrderDto, UpdateOrderDto, OrderResponseDto } from '../../../dto/order/order.dto';
import { PaginationDto } from '../../../dto/common/pagination.dto';

export interface IOrderService {
  // CRUD operations
  create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto>;
  findAll(pagination: PaginationDto, filters?: any): Promise<any>;
  findOne(id: string): Promise<OrderResponseDto>;
  update(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto>;
  remove(id: string): Promise<void>;

  // Business logic
  findByOrderNumber(orderNumber: string): Promise<OrderResponseDto>;
  findByTruckDriver(truckDriverId: string): Promise<OrderResponseDto[]>;
  findByVendor(vendorId: string): Promise<OrderResponseDto[]>;
  findByStatus(status: string): Promise<OrderResponseDto[]>;
  findPendingOrders(): Promise<OrderResponseDto[]>;
  findInProgressOrders(): Promise<OrderResponseDto[]>;
  findCompletedOrders(): Promise<OrderResponseDto[]>;
  findUrgentOrders(): Promise<OrderResponseDto[]>;
  updateStatus(id: string, status: string): Promise<OrderResponseDto>;
  updatePaymentInfo(id: string, paymentInfo: { method: string; transactionId?: string; paidAt?: Date }): Promise<OrderResponseDto>;
  updateDeliveryInfo(id: string, deliveryInfo: { scheduledDate?: Date; deliveredAt?: Date; deliveryAddress?: string; deliveryNotes?: string; deliveryPerson?: string }): Promise<OrderResponseDto>;
  updateLocation(id: string, location: { latitude: number; longitude: number; address: string }): Promise<OrderResponseDto>;
  findOrdersByDateRange(startDate: Date, endDate: Date): Promise<OrderResponseDto[]>;
  findOrdersByProduct(productId: string): Promise<OrderResponseDto[]>;
  getRevenueByDateRange(startDate: Date, endDate: Date): Promise<any>;
  getStats(): Promise<any>;
}
