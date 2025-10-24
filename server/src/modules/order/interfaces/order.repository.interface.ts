import { IBaseRepository } from 'src/common/repositories/base.repository.interface';
import { Order } from 'src/schemas/order.schema';

export interface IOrderRepository extends IBaseRepository<Order> {
  findAllPopulated(): Promise<Order[]>;

  findByIdPopulated(id: string): Promise<Order | null>;

  updatePopulated(id: string, updateData: Partial<Order>): Promise<Order>;
}
