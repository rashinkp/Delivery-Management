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
}
