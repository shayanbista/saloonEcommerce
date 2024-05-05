import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  DeleteDateColumn,
  ManyToOne,
} from "typeorm";

import { User } from "./User";

@Entity("bookings")
export class Booking extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  contact: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  address: string;

  @DeleteDateColumn({ name: "deletedAt", nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.booking)
  user: User;
}
