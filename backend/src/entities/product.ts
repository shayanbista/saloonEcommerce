import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  JoinTable,
  DeleteDateColumn,
} from "typeorm";
import { ProductImages } from "./ProductImages";

@Entity("products")
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  productCategory!: string;

  @Column()
  productName!: string;

  @Column({ type: "float" })
  amount!: number;

  @DeleteDateColumn({ name: "deletedAt", nullable: true })
  deletedAt: Date;

  [key: string]: any;

  @OneToMany(() => ProductImages, (productImages) => productImages.products)
  @JoinTable()
  productImages: ProductImages[];
}
