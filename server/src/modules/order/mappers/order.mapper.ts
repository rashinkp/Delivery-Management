
import { Order } from 'src/schemas/order.schema';
import { OrderResponseDto } from '../dto/order-response.dto';

export class OrderMapper {
  static toResponseDto(order: Order): OrderResponseDto {
    return new OrderResponseDto(order);
  }

  static toResponseDtoList(orders: Order[]): OrderResponseDto[] {
    return orders.map((order) => new OrderResponseDto(order));
  }
}
