import { IBaseRepository } from 'src/common/repositories/base.repository.interface';
import { Order } from 'src/schemas/order.schema';

export interface IOrderRepository extends IBaseRepository<Order> {
  findAllPopulated(): Promise<Order[]>;

  findByIdPopulated(id: string): Promise<Order | null>;

  updatePopulated(id: string, updateData: Partial<Order>): Promise<Order>;

  findByDriverId(driverId: string): Promise<Order[]>;

  findByVendorId(vendorId: string): Promise<Order[]>;

  findByStatus(status: string): Promise<Order[]>;
  findWithPagination(
    query: import('../dto/order-query.dto').OrderQueryDto,
  ): Promise<{
    data: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }>;
}
