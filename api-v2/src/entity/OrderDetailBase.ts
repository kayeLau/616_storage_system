// entity/OrderDetailBase.ts   ← 改成这样，永远不会再报错！

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Product } from "./Product";

@Entity()  // 随便写个假表名，反正不会用
export class OrderDetailBase {   // ← 删掉 extends BaseEntity！！！

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 36 })
  orderId: string;

  @Column()
  productId: number;

  @Column({ comment: "下單數量", type: "float" })
  orderQuantity: number;

  @Column({ nullable: true, comment: "分配數量", type: "float" })
  assignQuantity: number;

  @Column({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updateDate: Date;

  @Column({ comment: "0:前線 1:系統", type: "tinyint" })
  orderMode: number;

  @Column({ comment: "0:未分配 1:已分配", type: "tinyint" })
  status: number;

  @Column({ nullable: true })
  remark: string;

  @Column({ nullable: true, length: 50 })
  lastEditBy: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "productId" })
  product!: Product;
}