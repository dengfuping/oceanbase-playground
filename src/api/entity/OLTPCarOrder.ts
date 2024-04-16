import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'oltp_car_orders' })
export default class OLTPCarOrder {
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  @Column({ name: 'order_id', type: 'bigint' })
  orderId: number;

  @Column({ name: 'order_time', type: 'varchar' })
  orderTime: string;

  @Column({ name: 'car_price', type: 'decimal' })
  carPrice: number;

  @Column({ name: 'car_color', type: 'varchar' })
  carColor: string;

  @Column({ name: 'sale_region', type: 'varchar' })
  saleRegion: string;

  @Column({ name: 'sale_nation', type: 'varchar' })
  saleNation: string;

  @Column({ name: 'sale_region', type: 'varchar' })
  saleRegion: string;

  @Column({ name: 'customer_name', type: 'varchar' })
  customerName: string;
}
