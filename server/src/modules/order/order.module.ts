import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from 'src/schemas/order.schema';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
    {
      provide: 'IOrderService',
      useClass: OrderService,
    },
  ],
  exports: ['IOrderService'],
})
export class OrderModule {}
