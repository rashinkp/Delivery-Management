import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Order } from 'src/schemas/order.schema';
import { IOrderRepository } from './interfaces/order.repository.interface';

@Injectable()
export class OrderRepository
  extends BaseRepository<Order>
  implements IOrderRepository
{
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
  ) {
    super(orderModel);
  }
  private populateQuery(query: any) {
    return query
      .populate('driverId', 'name mobile')
      .populate('vendorId', 'name location contactNumber')
      .populate('products.productId', 'name price');
  }

  async findAllPopulated(): Promise<Order[]> {
    return this.populateQuery(this.orderModel.find()).exec();
  }

  async findByIdPopulated(id: string): Promise<Order | null> {
    return this.populateQuery(this.orderModel.findById(id)).exec();
  }

  async updatePopulated(
    id: string,
    updateData: Partial<Order>,
  ): Promise<Order> {
    return this.populateQuery(
      this.orderModel.findByIdAndUpdate(id, updateData, { new: true }),
    ).exec();
  }

  override async findAll(): Promise<Order[]> {
    return this.findAllPopulated();
  }

  override async findById(id: string): Promise<Order | null> {
    return this.findByIdPopulated(id);
  }

  override async update(
    id: string,
    data: Partial<Order>,
  ): Promise<Order> {
    return this.updatePopulated(id, data);
  }
}
