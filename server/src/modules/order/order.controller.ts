import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
  UsePipes,
  ValidationPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import type { IOrderService } from './interfaces/order.service.interface';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class OrderController {
  constructor(
    @Inject('IOrderService')
    private readonly orderService: IOrderService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('driver') // Only drivers can create orders
  async create(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<ApiResponseDto<any>> {
    try {
      const order = await this.orderService.create(createOrderDto);
      return ApiResponseDto.success(order, 'Order created successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to create order', error.message);
    }
  }

  @Get()
  @Roles('admin', 'driver') // Both admin and drivers can view orders
  async findAll(): Promise<ApiResponseDto<any>> {
    try {
      const orders = await this.orderService.findAll();
      return ApiResponseDto.success(orders, 'Orders retrieved successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to retrieve orders', error.message);
    }
  }

  @Get(':id')
  @Roles('admin', 'driver') // Both admin and drivers can view specific orders
  async findOne(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    try {
      const order = await this.orderService.findById(id);
      return ApiResponseDto.success(order, 'Order retrieved successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to retrieve order', error.message);
    }
  }

  @Patch(':id')
  @Roles('driver') // Only drivers can update orders
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<ApiResponseDto<any>> {
    try {
      const order = await this.orderService.update(id, updateOrderDto);
      return ApiResponseDto.success(order, 'Order updated successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to update order', error.message);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin') // Only admin can delete orders
  async remove(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    try {
      await this.orderService.remove(id);
      return ApiResponseDto.success(null, 'Order deleted successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to delete order', error.message);
    }
  }

  // Optional: Filter by driver
  @Get('driver/:driverId')
  @Roles('admin', 'driver') // Both admin and drivers can filter by driver
  async findByDriver(
    @Param('driverId') driverId: string,
  ): Promise<ApiResponseDto<any>> {
    try {
      const orders = await this.orderService.findByDriver(driverId);
      return ApiResponseDto.success(orders, 'Orders retrieved successfully');
    } catch (error) {
      return ApiResponseDto.error(
        'Failed to retrieve orders by driver',
        error.message,
      );
    }
  }

  // Optional: Filter by vendor
  @Get('vendor/:vendorId')
  @Roles('admin', 'driver') // Both admin and drivers can filter by vendor
  async findByVendor(
    @Param('vendorId') vendorId: string,
  ): Promise<ApiResponseDto<any>> {
    try {
      const orders = await this.orderService.findByVendor(vendorId);
      return ApiResponseDto.success(orders, 'Orders retrieved successfully');
    } catch (error) {
      return ApiResponseDto.error(
        'Failed to retrieve orders by vendor',
        error.message,
      );
    }
  }

  // Optional: Filter by status
  @Get('status/:status')
  @Roles('admin', 'driver') // Both admin and drivers can filter by status
  async findByStatus(
    @Param('status') status: string,
  ): Promise<ApiResponseDto<any>> {
    try {
      const orders = await this.orderService.findByStatus(status);
      return ApiResponseDto.success(orders, 'Orders retrieved successfully');
    } catch (error) {
      return ApiResponseDto.error(
        'Failed to retrieve orders by status',
        error.message,
      );
    }
  }
}
