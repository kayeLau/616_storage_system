import { Entity, PrimaryGeneratedColumn, Column , JoinColumn, ManyToOne } from "typeorm"
import { Product } from "./Product"
import { Shop } from "./Shop"

@Entity()
export class Inventory {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    productId: number

    @Column()
    shopId: string

    @Column()
    remain: number

    @Column()
    month: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateDate: Date;

    @Column()
    editBy: string

    @ManyToOne(() => Shop)
    @JoinColumn({ name: "shopId", referencedColumnName: "shopId" })
    shop: Shop;

    @ManyToOne(() => Product)
    @JoinColumn({ name: "productId", referencedColumnName: "productId" })
    product: Product;
}
