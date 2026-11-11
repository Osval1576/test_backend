import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from '../order-status.enum';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId!: string;

  @Column({ type: 'varchar', length: 20, default: OrderStatus.PENDING })
  status!: OrderStatus;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  total!: string; // numeric llega como string

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt!: Date | null;

  @OneToMany(() => OrderItem, (item) => item.order)
  items!: OrderItem[];
}
