import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Order } from 'src/schemas/order.schema';
import { IOrderRepository } from './interfaces/order.repository.interface';
import { OrderQueryDto } from './dto/order-query.dto';

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

  override async update(id: string, data: Partial<Order>): Promise<Order> {
    return this.updatePopulated(id, data);
  }

  async findByDriverId(driverId: string): Promise<Order[]> {
    return this.populateQuery(this.orderModel.find({ driverId })).exec();
  }

  async findByVendorId(vendorId: string): Promise<Order[]> {
    return this.populateQuery(this.orderModel.find({ vendorId })).exec();
  }

  async findByStatus(status: string): Promise<Order[]> {
    return this.populateQuery(
      this.orderModel.find({ orderStatus: status }),
    ).exec();
  }

  async findWithPagination(query: OrderQueryDto): Promise<{
    data: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      driverId,
      vendorId,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {};
    if (driverId) filter.driverId = driverId;
    if (vendorId) filter.vendorId = vendorId;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [{ orderNumber: { $regex: search, $options: 'i' } }];
    }

    const skip = (page - 1) * limit;
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      this.populateQuery(
        this.orderModel.find(filter).sort(sort).skip(skip).limit(limit),
      ).exec(),
      this.orderModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return { data, total, page, limit, totalPages, hasNext, hasPrev };
  }
}
