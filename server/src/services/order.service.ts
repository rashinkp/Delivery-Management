import { Injectable, Logger } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { CreateOrderDto, UpdateOrderDto, OrderResponseDto } from '../dto/order/order.dto';
import { PaginationDto } from '../dto/common/pagination.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { NotFoundException, ConflictException, ValidationException } from '../common/exceptions/custom.exceptions';
import { ORDER_STATUS } from '../common/constants/app-constants';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private readonly orderRepository: OrderRepository) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    this.logger.log('Creating new order', { vendor: createOrderDto.vendor });

    // Generate unique order number
    const orderNumber = await this.orderRepository.generateOrderNumber();

    // Validate products array
    if (!createOrderDto.products || createOrderDto.products.length === 0) {
      throw new ValidationException('Order must contain at least one product');
    }

    // Calculate total bill amount
    const calculatedTotal = createOrderDto.products.reduce((total, product) => {
      return total + (product.quantity * product.unitPrice);
    }, 0);

    // Validate total bill amount
    if (Math.abs(calculatedTotal - createOrderDto.totalBillAmount) > 0.01) {
      throw new ValidationException('Total bill amount does not match calculated amount');
    }

    // Validate collected amount
    if (createOrderDto.collectedAmount > createOrderDto.totalBillAmount) {
      throw new ValidationException('Collected amount cannot be greater than total bill amount');
    }

    // Create order
    const { deliveryInfo, location, expectedDeliveryDate, ...orderData } = createOrderDto;
    const order = await this.orderRepository.create({
      ...orderData,
      orderNumber,
      orderDate: new Date(),
      pendingAmount: createOrderDto.totalBillAmount - createOrderDto.collectedAmount,
      truckDriver: createOrderDto.truckDriver as any,
      vendor: createOrderDto.vendor as any,
      expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate) : undefined,
      deliveryInfo: deliveryInfo ? {
        ...deliveryInfo,
        scheduledDate: deliveryInfo.scheduledDate ? new Date(deliveryInfo.scheduledDate) : undefined
      } : undefined,
      location: location ? {
        ...location,
        timestamp: new Date()
      } : undefined,
      products: createOrderDto.products.map(product => ({
        ...product,
        product: product.product as any,
        totalPrice: product.quantity * product.unitPrice
      }))
    });

    this.logger.log('Order created successfully', { id: order._id, orderNumber });

    return this.mapToResponseDto(order);
  }

  async findAll(pagination: PaginationDto, filters?: any): Promise<any> {
    this.logger.log('Fetching orders with pagination', { pagination, filters });

    const result = await this.orderRepository.findOrdersWithPagination(pagination, filters);
    
    return {
      ...result,
      data: result.data.map(order => this.mapToResponseDto(order))
    };
  }

  async findOne(id: string): Promise<OrderResponseDto> {
    this.logger.log('Fetching order by id', { id });

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.mapToResponseDto(order);
  }

  async findByOrderNumber(orderNumber: string): Promise<OrderResponseDto> {
    this.logger.log('Fetching order by order number', { orderNumber });

    const order = await this.orderRepository.findByOrderNumber(orderNumber);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.mapToResponseDto(order);
  }

  async findByTruckDriver(truckDriverId: string): Promise<OrderResponseDto[]> {
    this.logger.log('Fetching orders by truck driver', { truckDriverId });

    const orders = await this.orderRepository.findByTruckDriver(truckDriverId);
    return orders.map(order => this.mapToResponseDto(order));
  }

  async findByVendor(vendorId: string): Promise<OrderResponseDto[]> {
    this.logger.log('Fetching orders by vendor', { vendorId });

    const orders = await this.orderRepository.findByVendor(vendorId);
    return orders.map(order => this.mapToResponseDto(order));
  }

  async findByStatus(status: string): Promise<OrderResponseDto[]> {
    this.logger.log('Fetching orders by status', { status });

    const orders = await this.orderRepository.findByStatus(status);
    return orders.map(order => this.mapToResponseDto(order));
  }

  async findPendingOrders(): Promise<OrderResponseDto[]> {
    this.logger.log('Fetching pending orders');

    const orders = await this.orderRepository.findPendingOrders();
    return orders.map(order => this.mapToResponseDto(order));
  }

  async findInProgressOrders(): Promise<OrderResponseDto[]> {
    this.logger.log('Fetching in-progress orders');

    const orders = await this.orderRepository.findInProgressOrders();
    return orders.map(order => this.mapToResponseDto(order));
  }

  async findCompletedOrders(): Promise<OrderResponseDto[]> {
    this.logger.log('Fetching completed orders');

    const orders = await this.orderRepository.findCompletedOrders();
    return orders.map(order => this.mapToResponseDto(order));
  }

  async findUrgentOrders(): Promise<OrderResponseDto[]> {
    this.logger.log('Fetching urgent orders');

    const orders = await this.orderRepository.findUrgentOrders();
    return orders.map(order => this.mapToResponseDto(order));
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
    this.logger.log('Updating order', { id });

    const existingOrder = await this.orderRepository.findById(id);
    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    // Validate status transition
    if (updateOrderDto.status) {
      const validTransitions = this.getValidStatusTransitions(existingOrder.status);
      if (!validTransitions.includes(updateOrderDto.status)) {
        throw new ValidationException(`Invalid status transition from ${existingOrder.status} to ${updateOrderDto.status}`);
      }
    }

    // Validate collected amount if being updated
    if (updateOrderDto.collectedAmount !== undefined) {
      if (updateOrderDto.collectedAmount > existingOrder.totalBillAmount) {
        throw new ValidationException('Collected amount cannot be greater than total bill amount');
      }
    }

    const updatedOrder = await this.orderRepository.updateById(id, {
      ...updateOrderDto,
      pendingAmount: updateOrderDto.collectedAmount !== undefined 
        ? existingOrder.totalBillAmount - updateOrderDto.collectedAmount
        : existingOrder.pendingAmount,
      updatedAt: new Date(),
    });

    if (!updatedOrder) {
      throw new NotFoundException('Order not found');
    }

    this.logger.log('Order updated successfully', { id });

    return this.mapToResponseDto(updatedOrder);
  }

  async remove(id: string): Promise<void> {
    this.logger.log('Deleting order', { id });

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if order can be deleted (only pending orders)
    if (order.status !== ORDER_STATUS.PENDING) {
      throw new ValidationException('Only pending orders can be deleted');
    }

    // Soft delete
    await this.orderRepository.updateById(id, {
      isActive: false,
      updatedAt: new Date(),
    });

    this.logger.log('Order deleted successfully', { id });
  }

  async getStats(): Promise<any> {
    this.logger.log('Fetching order statistics');

    const stats = await this.orderRepository.getOrderStats();
    return ResponseUtil.success(stats, 'Order statistics retrieved successfully');
  }

  async updateStatus(id: string, status: string): Promise<OrderResponseDto> {
    this.logger.log('Updating order status', { id, status });

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Validate status transition
    const validTransitions = this.getValidStatusTransitions(order.status);
    if (!validTransitions.includes(status)) {
      throw new ValidationException(`Invalid status transition from ${order.status} to ${status}`);
    }

    const updatedOrder = await this.orderRepository.updateStatus(id, status);
    if (!updatedOrder) {
      throw new NotFoundException('Order not found');
    }

    this.logger.log('Order status updated successfully', { id, status });

    return this.mapToResponseDto(updatedOrder);
  }

  async updatePaymentInfo(
    id: string, 
    paymentInfo: { method: string; transactionId?: string; paidAt?: Date }
  ): Promise<OrderResponseDto> {
    this.logger.log('Updating order payment info', { id, paymentInfo });

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = await this.orderRepository.updatePaymentInfo(id, paymentInfo);
    if (!updatedOrder) {
      throw new NotFoundException('Order not found');
    }

    this.logger.log('Order payment info updated successfully', { id });

    return this.mapToResponseDto(updatedOrder);
  }

  async updateDeliveryInfo(
    id: string,
    deliveryInfo: {
      scheduledDate?: Date;
      deliveredAt?: Date;
      deliveryAddress?: string;
      deliveryNotes?: string;
      deliveryPerson?: string;
    }
  ): Promise<OrderResponseDto> {
    this.logger.log('Updating order delivery info', { id, deliveryInfo });

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = await this.orderRepository.updateDeliveryInfo(id, deliveryInfo);
    if (!updatedOrder) {
      throw new NotFoundException('Order not found');
    }

    this.logger.log('Order delivery info updated successfully', { id });

    return this.mapToResponseDto(updatedOrder);
  }

  async updateLocation(
    id: string,
    location: { latitude: number; longitude: number; address: string }
  ): Promise<OrderResponseDto> {
    this.logger.log('Updating order location', { id, location });

    // Validate coordinates
    if (location.latitude < -90 || location.latitude > 90) {
      throw new ValidationException('Invalid latitude. Must be between -90 and 90');
    }
    if (location.longitude < -180 || location.longitude > 180) {
      throw new ValidationException('Invalid longitude. Must be between -180 and 180');
    }

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = await this.orderRepository.updateLocation(id, location);
    if (!updatedOrder) {
      throw new NotFoundException('Order not found');
    }

    this.logger.log('Order location updated successfully', { id });

    return this.mapToResponseDto(updatedOrder);
  }

  async findOrdersByDateRange(startDate: Date, endDate: Date): Promise<OrderResponseDto[]> {
    this.logger.log('Fetching orders by date range', { startDate, endDate });

    const orders = await this.orderRepository.findOrdersByDateRange(startDate, endDate);
    return orders.map(order => this.mapToResponseDto(order));
  }

  async findOrdersByProduct(productId: string): Promise<OrderResponseDto[]> {
    this.logger.log('Fetching orders by product', { productId });

    const orders = await this.orderRepository.findOrdersByProduct(productId);
    return orders.map(order => this.mapToResponseDto(order));
  }

  async getRevenueByDateRange(startDate: Date, endDate: Date): Promise<any> {
    this.logger.log('Fetching revenue by date range', { startDate, endDate });

    const revenue = await this.orderRepository.getRevenueByDateRange(startDate, endDate);
    return ResponseUtil.success(revenue, 'Revenue data retrieved successfully');
  }

  private getValidStatusTransitions(currentStatus: string): string[] {
    const statusTransitions: Record<string, string[]> = {
      [ORDER_STATUS.PENDING]: [ORDER_STATUS.IN_PROGRESS, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.IN_PROGRESS]: [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.COMPLETED]: [], // No transitions from completed
      [ORDER_STATUS.CANCELLED]: [], // No transitions from cancelled
    };

    return statusTransitions[currentStatus] || [];
  }

  private mapToResponseDto(order: any): OrderResponseDto {
    return {
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      truckDriver: {
        id: order.truckDriver.toString(),
        name: order.truckDriverName || 'Unknown Driver',
        mobile: order.truckDriverMobile || 'Unknown'
      },
      vendor: {
        id: order.vendor.toString(),
        name: order.vendorName || 'Unknown Vendor',
        mobile: order.vendorMobile || 'Unknown',
        address: order.vendorAddress || 'Unknown'
      },
      products: order.products.map((product: any) => ({
        product: {
          id: product.product.toString(),
          name: product.productName || 'Unknown Product',
          price: product.unitPrice
        },
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        totalPrice: product.totalPrice
      })),
      totalBillAmount: order.totalBillAmount,
      collectedAmount: order.collectedAmount,
      pendingAmount: order.pendingAmount,
      status: order.status,
      paymentInfo: order.paymentInfo,
      deliveryInfo: order.deliveryInfo,
      location: order.location,
      notes: order.notes,
      metadata: order.metadata,
      orderDate: order.orderDate,
      expectedDeliveryDate: order.expectedDeliveryDate,
      actualDeliveryDate: order.actualDeliveryDate,
      isUrgent: order.isUrgent,
      tags: order.tags,
      discounts: order.discounts,
      taxes: order.taxes,
      isActive: order.isActive,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
