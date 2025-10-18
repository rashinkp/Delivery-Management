import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { CreateOrderDto, UpdateOrderDto } from '../dto/order/order.dto';
import { PaginationDto } from '../dto/common/pagination.dto';
import { ResponseUtil } from '../common/utils/response.util';
import type { ApiResponse } from '../common/interfaces/api-response.interface';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto): Promise<ApiResponse<any>> {
    const order = await this.orderService.create(createOrderDto);
    return ResponseUtil.created(order, 'Order created successfully');
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('search') search?: string,
    @Query('truckDriver') truckDriver?: string,
    @Query('vendor') vendor?: string,
    @Query('status') status?: string,
    @Query('isUrgent') isUrgent?: boolean,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('minAmount') minAmount?: number,
    @Query('maxAmount') maxAmount?: number,
    @Query('tags') tags?: string,
  ): Promise<ApiResponse<any>> {
    const filters = {
      search,
      truckDriver,
      vendor,
      status,
      isUrgent,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      minAmount,
      maxAmount,
      tags: tags ? tags.split(',') : undefined,
    };

    const result = await this.orderService.findAll(pagination, filters);
    return ResponseUtil.success(result, 'Orders retrieved successfully');
  }

  @Get('stats')
  async getStats(): Promise<ApiResponse<any>> {
    return await this.orderService.getStats();
  }

  @Get('pending')
  async findPendingOrders(): Promise<ApiResponse<any>> {
    const orders = await this.orderService.findPendingOrders();
    return ResponseUtil.success(orders, 'Pending orders retrieved successfully');
  }

  @Get('in-progress')
  async findInProgressOrders(): Promise<ApiResponse<any>> {
    const orders = await this.orderService.findInProgressOrders();
    return ResponseUtil.success(orders, 'In-progress orders retrieved successfully');
  }

  @Get('completed')
  async findCompletedOrders(): Promise<ApiResponse<any>> {
    const orders = await this.orderService.findCompletedOrders();
    return ResponseUtil.success(orders, 'Completed orders retrieved successfully');
  }

  @Get('urgent')
  async findUrgentOrders(): Promise<ApiResponse<any>> {
    const orders = await this.orderService.findUrgentOrders();
    return ResponseUtil.success(orders, 'Urgent orders retrieved successfully');
  }

  @Get('by-date-range')
  async findOrdersByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<ApiResponse<any>> {
    const orders = await this.orderService.findOrdersByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
    return ResponseUtil.success(orders, 'Orders by date range retrieved successfully');
  }

  @Get('by-product/:productId')
  async findOrdersByProduct(@Param('productId') productId: string): Promise<ApiResponse<any>> {
    const orders = await this.orderService.findOrdersByProduct(productId);
    return ResponseUtil.success(orders, 'Orders by product retrieved successfully');
  }

  @Get('revenue-by-date-range')
  async getRevenueByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<ApiResponse<any>> {
    return await this.orderService.getRevenueByDateRange(new Date(startDate), new Date(endDate));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<any>> {
    const order = await this.orderService.findOne(id);
    return ResponseUtil.success(order, 'Order retrieved successfully');
  }

  @Get('order-number/:orderNumber')
  async findByOrderNumber(@Param('orderNumber') orderNumber: string): Promise<ApiResponse<any>> {
    const order = await this.orderService.findByOrderNumber(orderNumber);
    return ResponseUtil.success(order, 'Order retrieved successfully');
  }

  @Get('truck-driver/:truckDriverId')
  async findByTruckDriver(@Param('truckDriverId') truckDriverId: string): Promise<ApiResponse<any>> {
    const orders = await this.orderService.findByTruckDriver(truckDriverId);
    return ResponseUtil.success(orders, 'Orders by truck driver retrieved successfully');
  }

  @Get('vendor/:vendorId')
  async findByVendor(@Param('vendorId') vendorId: string): Promise<ApiResponse<any>> {
    const orders = await this.orderService.findByVendor(vendorId);
    return ResponseUtil.success(orders, 'Orders by vendor retrieved successfully');
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string): Promise<ApiResponse<any>> {
    const orders = await this.orderService.findByStatus(status);
    return ResponseUtil.success(orders, 'Orders by status retrieved successfully');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<ApiResponse<any>> {
    const order = await this.orderService.update(id, updateOrderDto);
    return ResponseUtil.updated(order, 'Order updated successfully');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.orderService.remove(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ): Promise<ApiResponse<any>> {
    const order = await this.orderService.updateStatus(id, body.status);
    return ResponseUtil.updated(order, 'Order status updated successfully');
  }

  @Patch(':id/payment-info')
  async updatePaymentInfo(
    @Param('id') id: string,
    @Body() paymentInfo: { method: string; transactionId?: string; paidAt?: Date },
  ): Promise<ApiResponse<any>> {
    const order = await this.orderService.updatePaymentInfo(id, paymentInfo);
    return ResponseUtil.updated(order, 'Order payment info updated successfully');
  }

  @Patch(':id/delivery-info')
  async updateDeliveryInfo(
    @Param('id') id: string,
    @Body() deliveryInfo: {
      scheduledDate?: Date;
      deliveredAt?: Date;
      deliveryAddress?: string;
      deliveryNotes?: string;
      deliveryPerson?: string;
    },
  ): Promise<ApiResponse<any>> {
    const order = await this.orderService.updateDeliveryInfo(id, deliveryInfo);
    return ResponseUtil.updated(order, 'Order delivery info updated successfully');
  }

  @Patch(':id/location')
  async updateLocation(
    @Param('id') id: string,
    @Body() location: { latitude: number; longitude: number; address: string },
  ): Promise<ApiResponse<any>> {
    const order = await this.orderService.updateLocation(id, location);
    return ResponseUtil.updated(order, 'Order location updated successfully');
  }
}
