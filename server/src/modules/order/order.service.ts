// src/orders/order.service.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { IOrderRepository } from './interfaces/order.repository.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderMapper } from './mappers/order.mapper';
import { IOrderService } from './interfaces/order.service.interface';
import { Types } from 'mongoose';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  private toEntity(dto: CreateOrderDto | UpdateOrderDto): any {
    const items = dto.products?.map((p) => ({
      productId: new Types.ObjectId(p.productId),
      quantity: p.quantity,
      price: (p as any).price,
    }));

    const totalBill = items?.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0);

    return {
      // spread last so our normalized fields are not overridden by incoming dto
      driverId: dto.driverId ? new Types.ObjectId(dto.driverId) : undefined,
      vendorId: dto.vendorId ? new Types.ObjectId(dto.vendorId) : undefined,
      products: items,
      totalBill,
      collectedAmount: (dto as any).collectedAmount ?? 0,
      orderStatus: (dto as any).status ?? undefined,
      ...dto,
    };
  }

  async create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const entity = this.toEntity(createOrderDto);
    const order = await this.orderRepository.create(entity);
    return OrderMapper.toResponseDto(order);
  }

  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.findAll();
    return OrderMapper.toResponseDtoList(orders); // Fixed: was missing parentheses
  }

  async findById(id: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return OrderMapper.toResponseDto(order);
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    await this.findById(id); // validates existence
    const entity = this.toEntity(updateOrderDto);
    const updatedOrder = await this.orderRepository.update(id, entity);
    return OrderMapper.toResponseDto(updatedOrder);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    const deleted = await this.orderRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Failed to delete order');
    }
  }

  async findByDriver(driverId: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.findByDriverId(driverId);
    return OrderMapper.toResponseDtoList(orders);
  }

  async findByVendor(vendorId: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.findByVendorId(vendorId);
    return OrderMapper.toResponseDtoList(orders);
  }

  async findByStatus(status: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.findByStatus(status);
    return OrderMapper.toResponseDtoList(orders);
  }
}
