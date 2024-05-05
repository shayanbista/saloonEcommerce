import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  DeleteDateColumn,
} from "typeorm";
import { User } from "./User";
import { Product } from "./product";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  orderDate: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  totalAmount: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  quantity: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @DeleteDateColumn({ name: "deletedAt", nullable: true })
  deletedAt: Date;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];
}
