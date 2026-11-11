import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    private readonly dataSource: DataSource,
  ) {}

  // orden + items en una transaccion
  async create(dto: CreateOrderDto, total: string): Promise<Order> {
    const orderId = await this.dataSource.transaction(async (manager) => {
      const order = await manager.save(Order, { customerId: dto.customerId, total });

      const items = dto.items.map((item) =>
        manager.create(OrderItem, { ...item, price: item.price.toFixed(2), order }),
      );
      await manager.save(OrderItem, items);

      return order.id;
    });

    return (await this.findById(orderId))!;
  }

  findById(id: string): Promise<Order | null> {
    return this.orders.findOne({ where: { id }, relations: { items: true } });
  }

  save(order: Order): Promise<Order> {
    return this.orders.save(order);
  }
}
