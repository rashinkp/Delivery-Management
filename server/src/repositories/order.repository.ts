import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../common/repositories/base.repository';
import { Order, OrderDocument } from '../schemas/order.schema';
import { CreateOrderDto, UpdateOrderDto } from '../dto/order/order.dto';
import { PaginationDto } from '../dto/common/pagination.dto';
import { ORDER_STATUS } from '../common/constants/app-constants';

@Injectable()
export class OrderRepository extends BaseRepository<OrderDocument> {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>) {
    super(orderModel);
  }

  // Custom methods specific to Order entity
  async findByOrderNumber(orderNumber: string): Promise<OrderDocument | null> {
    return this.findOne({ orderNumber, isActive: true });
  }

  async checkOrderNumberExists(orderNumber: string, excludeId?: string): Promise<boolean> {
    const query: any = { orderNumber };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return this.exists(query);
  }

  async generateOrderNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Find the last order of the day
    const lastOrder = await this.findOne({
      orderNumber: { $regex: `^ORD${dateStr}` },
      isActive: true
    });

    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
      sequence = lastSequence + 1;
    }

    return `ORD${dateStr}${sequence.toString().padStart(4, '0')}`;
  }

  async findByTruckDriver(truckDriverId: string): Promise<OrderDocument[]> {
    return this.findMany({
      truckDriver: truckDriverId,
      isActive: true
    }, { sort: { createdAt: -1 } });
  }

  async findByVendor(vendorId: string): Promise<OrderDocument[]> {
    return this.findMany({
      vendor: vendorId,
      isActive: true
    }, { sort: { createdAt: -1 } });
  }

  async findByStatus(status: string): Promise<OrderDocument[]> {
    return this.findMany({
      status,
      isActive: true
    }, { sort: { createdAt: -1 } });
  }

  async findPendingOrders(): Promise<OrderDocument[]> {
    return this.findMany({
      status: ORDER_STATUS.PENDING,
      isActive: true
    }, { sort: { createdAt: 1 } });
  }

  async findInProgressOrders(): Promise<OrderDocument[]> {
    return this.findMany({
      status: ORDER_STATUS.IN_PROGRESS,
      isActive: true
    }, { sort: { createdAt: -1 } });
  }

  async findCompletedOrders(): Promise<OrderDocument[]> {
    return this.findMany({
      status: ORDER_STATUS.COMPLETED,
      isActive: true
    }, { sort: { actualDeliveryDate: -1 } });
  }

  async findUrgentOrders(): Promise<OrderDocument[]> {
    return this.findMany({
      isUrgent: true,
      isActive: true,
      status: { $in: [ORDER_STATUS.PENDING, ORDER_STATUS.IN_PROGRESS] }
    }, { sort: { createdAt: 1 } });
  }

  async updateStatus(id: string, status: string): Promise<OrderDocument | null> {
    const updateData: any = { status };
    
    if (status === ORDER_STATUS.IN_PROGRESS) {
      updateData.actualDeliveryDate = new Date();
    } else if (status === ORDER_STATUS.COMPLETED) {
      updateData.actualDeliveryDate = new Date();
    }

    return this.updateById(id, updateData);
  }

  async updatePaymentInfo(id: string, paymentInfo: {
    method: string;
    transactionId?: string;
    paidAt?: Date;
  }): Promise<OrderDocument | null> {
    return this.updateById(id, { paymentInfo });
  }

  async updateDeliveryInfo(id: string, deliveryInfo: {
    scheduledDate?: Date;
    deliveredAt?: Date;
    deliveryAddress?: string;
    deliveryNotes?: string;
    deliveryPerson?: string;
  }): Promise<OrderDocument | null> {
    return this.updateById(id, { deliveryInfo });
  }

  async updateLocation(id: string, location: {
    latitude: number;
    longitude: number;
    address: string;
  }): Promise<OrderDocument | null> {
    return this.updateById(id, {
      location: {
        ...location,
        timestamp: new Date()
      }
    });
  }

  async findOrdersWithPagination(
    pagination: PaginationDto,
    filters?: {
      search?: string;
      truckDriver?: string;
      vendor?: string;
      status?: string;
      isUrgent?: boolean;
      dateFrom?: Date;
      dateTo?: Date;
      minAmount?: number;
      maxAmount?: number;
      tags?: string[];
    }
  ): Promise<{
    data: OrderDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    
    let query: any = {};
    
    // Apply filters
    if (filters) {
      if (filters.search) {
        query.$or = [
          { orderNumber: { $regex: filters.search, $options: 'i' } },
          { 'notes.adminNotes': { $regex: filters.search, $options: 'i' } },
          { 'notes.driverNotes': { $regex: filters.search, $options: 'i' } },
          { 'notes.vendorNotes': { $regex: filters.search, $options: 'i' } }
        ];
      }
      
      if (filters.truckDriver) query.truckDriver = filters.truckDriver;
      if (filters.vendor) query.vendor = filters.vendor;
      if (filters.status) query.status = filters.status;
      if (filters.isUrgent !== undefined) query.isUrgent = filters.isUrgent;
      
      if (filters.dateFrom || filters.dateTo) {
        query.orderDate = {};
        if (filters.dateFrom) query.orderDate.$gte = filters.dateFrom;
        if (filters.dateTo) query.orderDate.$lte = filters.dateTo;
      }
      
      if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
        query.totalBillAmount = {};
        if (filters.minAmount !== undefined) query.totalBillAmount.$gte = filters.minAmount;
        if (filters.maxAmount !== undefined) query.totalBillAmount.$lte = filters.maxAmount;
      }
      
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }
    }

    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    return this.findWithPagination(query, page, limit, sort);
  }

  async getOrderStats(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    urgent: number;
    totalRevenue: number;
    averageOrderValue: number;
    byStatus: Array<{ status: string; count: number }>;
    byTruckDriver: Array<{ truckDriver: string; count: number }>;
    byVendor: Array<{ vendor: string; count: number }>;
  }> {
    const pipeline = [
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', ORDER_STATUS.PENDING] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', ORDER_STATUS.IN_PROGRESS] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', ORDER_STATUS.COMPLETED] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', ORDER_STATUS.CANCELLED] }, 1, 0] } },
          urgent: { $sum: { $cond: [{ $eq: ['$isUrgent', true] }, 1, 0] } },
          totalRevenue: { $sum: '$totalBillAmount' },
          averageOrderValue: { $avg: '$totalBillAmount' }
        }
      }
    ];

    const statusStats = await this.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const truckDriverStats = await this.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$truckDriver',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const vendorStats = await this.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$vendor',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const result = await this.aggregate(pipeline);
    const baseStats = result[0] || {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      urgent: 0,
      totalRevenue: 0,
      averageOrderValue: 0
    };

    return {
      ...baseStats,
      byStatus: statusStats.map(item => ({ status: item._id, count: item.count })),
      byTruckDriver: truckDriverStats.map(item => ({ truckDriver: item._id.toString(), count: item.count })),
      byVendor: vendorStats.map(item => ({ vendor: item._id.toString(), count: item.count }))
    };
  }

  async findOrdersByDateRange(startDate: Date, endDate: Date): Promise<OrderDocument[]> {
    return this.findMany({
      orderDate: {
        $gte: startDate,
        $lte: endDate
      },
      isActive: true
    }, { sort: { orderDate: -1 } });
  }

  async findOrdersByProduct(productId: string): Promise<OrderDocument[]> {
    return this.findMany({
      'products.product': productId,
      isActive: true
    }, { sort: { createdAt: -1 } });
  }

  async getRevenueByDateRange(startDate: Date, endDate: Date): Promise<{
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
  }> {
    const pipeline = [
      {
        $match: {
          orderDate: {
            $gte: startDate,
            $lte: endDate
          },
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalBillAmount' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalBillAmount' }
        }
      }
    ];

    const result = await this.aggregate(pipeline);
    return result[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0
    };
  }
}
