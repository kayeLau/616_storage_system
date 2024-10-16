import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Index } from "typeorm"
import { Product } from "./Product"
import { Shop } from "./Shop"

@Entity()
export class Inventory {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 50, unique: true })
    uniqueCode: string

    @Column()
    productId: number

    @Column({ length: 36 })
    shopId: string

    @Column()
    remain: number

    @Column({ length: 6 })
    month: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateDate: Date;

    @Column({ length: 10 })
    editBy: string

    @ManyToOne(() => Shop)
    @JoinColumn({ name: "shopId", referencedColumnName: "shopId" })
    shop: Shop;

    @ManyToOne(() => Product)
    @JoinColumn({ name: "productId", referencedColumnName: "productId" })
    product: Product;
}
