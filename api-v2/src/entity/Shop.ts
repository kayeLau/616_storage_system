import { Entity, PrimaryGeneratedColumn, Column , OneToMany , JoinColumn } from "typeorm"
import { Order } from "./Order"

@Entity()
export class Shop {

    @PrimaryGeneratedColumn("uuid")
    shopId: string

    @Column()
    shopCode: string

    @Column()
    shopName: string

    @Column()
    shopType: number

    @Column()
    shopOrder: number

    @Column({ nullable: true })
    productCount: number

    @Column()
    shopPartition: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createDate: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateDate: Date;

    @OneToMany(() => Order, order => order.shop) // Define the relationship
    orders: Order[]; // Array of orders associated with this shop
}
