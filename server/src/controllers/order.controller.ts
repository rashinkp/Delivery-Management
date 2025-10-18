import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { CreateOrderDto, UpdateOrderDto } from '../dto/order/order.dto';
import { PaginationDto } from '../dto/common/pagination.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { USER_ROLES } from '../common/constants/app-constants';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.orderService.create(createOrderDto);
    return ResponseUtil.success(order, 'Order created successfully');
  }

  @Get()
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.orderService.findAll(paginationDto);
    return ResponseUtil.success(result, 'Orders retrieved successfully');
  }

  @Get('pending')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findPending() {
    const orders = await this.orderService.findPendingOrders();
    return ResponseUtil.success(orders, 'Pending orders retrieved successfully');
  }

  @Get('in-progress')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findInProgress() {
    const orders = await this.orderService.findInProgressOrders();
    return ResponseUtil.success(orders, 'In-progress orders retrieved successfully');
  }

  @Get('completed')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findCompleted() {
    const orders = await this.orderService.findCompletedOrders();
    return ResponseUtil.success(orders, 'Completed orders retrieved successfully');
  }

  @Get('urgent')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findUrgent() {
    const orders = await this.orderService.findUrgentOrders();
    return ResponseUtil.success(orders, 'Urgent orders retrieved successfully');
  }

  @Get('by-driver/:driverId')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findByDriver(@Param('driverId') driverId: string) {
    const orders = await this.orderService.findByTruckDriver(driverId);
    return ResponseUtil.success(orders, 'Orders by driver retrieved successfully');
  }

  @Get('by-vendor/:vendorId')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findByVendor(@Param('vendorId') vendorId: string) {
    const orders = await this.orderService.findByVendor(vendorId);
    return ResponseUtil.success(orders, 'Orders by vendor retrieved successfully');
  }

  @Get('by-status/:status')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findByStatus(@Param('status') status: string) {
    const orders = await this.orderService.findByStatus(status);
    return ResponseUtil.success(orders, 'Orders by status retrieved successfully');
  }

  @Get('by-date-range')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const orders = await this.orderService.findOrdersByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
    return ResponseUtil.success(orders, 'Orders by date range retrieved successfully');
  }

  @Get('by-product/:productId')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findByProduct(@Param('productId') productId: string) {
    const orders = await this.orderService.findOrdersByProduct(productId);
    return ResponseUtil.success(orders, 'Orders by product retrieved successfully');
  }

  @Get('revenue')
  @Roles(USER_ROLES.ADMIN)
  async getRevenue(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const revenue = await this.orderService.getRevenueByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
    return ResponseUtil.success(revenue, 'Revenue data retrieved successfully');
  }

  @Get('stats')
  @Roles(USER_ROLES.ADMIN)
  async getStats() {
    const stats = await this.orderService.getStats();
    return ResponseUtil.success(stats, 'Order statistics retrieved successfully');
  }

  @Get(':id')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findOne(@Param('id') id: string) {
    const order = await this.orderService.findOne(id);
    return ResponseUtil.success(order, 'Order retrieved successfully');
  }

  @Patch(':id')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    const order = await this.orderService.update(id, updateOrderDto);
    return ResponseUtil.success(order, 'Order updated successfully');
  }

  @Patch(':id/status')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const order = await this.orderService.updateStatus(id, status);
    return ResponseUtil.success(order, 'Order status updated successfully');
  }

  @Patch(':id/payment')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async updatePayment(
    @Param('id') id: string,
    @Body() paymentInfo: { method: string; transactionId?: string; paidAt?: Date },
  ) {
    const order = await this.orderService.updatePaymentInfo(id, paymentInfo);
    return ResponseUtil.success(order, 'Order payment updated successfully');
  }

  @Patch(':id/delivery')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async updateDelivery(
    @Param('id') id: string,
    @Body() deliveryInfo: {
      scheduledDate?: Date;
      deliveredAt?: Date;
      deliveryAddress?: string;
      deliveryNotes?: string;
      deliveryPerson?: string;
    },
  ) {
    const order = await this.orderService.updateDeliveryInfo(id, deliveryInfo);
    return ResponseUtil.success(order, 'Order delivery updated successfully');
  }

  @Patch(':id/location')
  @Roles(USER_ROLES.TRUCK_DRIVER)
  async updateLocation(
    @Param('id') id: string,
    @Body() location: { latitude: number; longitude: number; address: string; timestamp: Date },
  ) {
    const order = await this.orderService.updateLocation(id, location);
    return ResponseUtil.success(order, 'Order location updated successfully');
  }

  @Delete(':id')
  @Roles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.orderService.remove(id);
    return ResponseUtil.success(null, 'Order deleted successfully');
  }

  @Get('order-number/:orderNumber')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    const order = await this.orderService.findByOrderNumber(orderNumber);
    return ResponseUtil.success(order, 'Order retrieved successfully');
  }
}