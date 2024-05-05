import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinTable,
  DeleteDateColumn,
} from "typeorm";
import { Product } from "./product";

@Entity("productImages")
export class ProductImages extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => Product, (products) => products.productImages)
  products: Product;

  @DeleteDateColumn({ name: "deletedAt", nullable: true })
  deletedAt: Date;
}
