import { Booking } from "./Booking";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  DeleteDateColumn,
} from "typeorm";

import { Order } from "./Order";

@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  role: string;

  @DeleteDateColumn({ name: "deletedAt", nullable: true })
  deletedAt: Date;

  [key: string]: any;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Booking, (booking) => booking.user)
  booking: Booking[];
}
