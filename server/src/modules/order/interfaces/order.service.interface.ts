import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderResponseDto } from '../dto/order-response.dto';

export interface IOrderService {
  create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto>;
  findAll(): Promise<OrderResponseDto[]>;
  findById(id: string): Promise<OrderResponseDto>;
  update(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto>;
  remove(id: string): Promise<void>;

  findByDriver(driverId: string): Promise<OrderResponseDto[]>;
  findByVendor(vendorId: string): Promise<OrderResponseDto[]>;
  findByStatus(status: string): Promise<OrderResponseDto[]>;
  findWithPagination(
    query: import('../dto/order-query.dto').OrderQueryDto,
  ): Promise<{
    data: OrderResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }>;

  updateStatus(
    id: string,
    status: 'pending' | 'delivered',
    driverId: string,
  ): Promise<OrderResponseDto>;

  deliver(id: string, driverId: string): Promise<OrderResponseDto>;
}
