import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { ALLOWED_TRANSITIONS, OrderStatus } from './order-status.enum';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject('NATS_SERVICE') private readonly nats: ClientProxy,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const total = dto.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2);

    const order = await this.ordersRepository.create(dto, total);
    await this.publish('order.created', order);
    return order;
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findById(id);
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  async changeStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);

    if (!ALLOWED_TRANSITIONS[order.status].includes(status)) {
      throw new BadRequestException(`Cannot change status from ${order.status} to ${status}`);
    }

    order.status = status;
    if (status === OrderStatus.PAID) order.paidAt = new Date();
    const updated = await this.ordersRepository.save(order);

    if (status === OrderStatus.PAID) await this.publish('order.paid', updated);
    return updated;
  }

  // si falla NATS la orden ya se guardo, solo se registra el error
  // TODO: usar outbox para no perder eventos
  private async publish(pattern: string, order: Order): Promise<void> {
    try {
      await lastValueFrom(this.nats.emit(pattern, order), { defaultValue: undefined });
      this.logger.log(`Event ${pattern} published for order ${order.id}`);
    } catch (error) {
      this.logger.error(`Could not publish ${pattern} for order ${order.id}`, error);
    }
  }
}
