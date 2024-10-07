import { Entity, PrimaryGeneratedColumn, Column , ManyToOne , JoinColumn } from "typeorm"
import { Product } from './Product';

@Entity()
export class OrderDetail {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    orderId: string

    @Column()
    productId: number

    @Column()
    orderQuantity: number

    @Column({nullable:true})
    assignQuantity: number

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateDate: Date

    @Column()
    orderMode: number
    
    @Column()
    status: number;

    @Column({nullable:true})
    remark: string;

    @Column({nullable:true})
    lastEditBy: string

    @ManyToOne(() => Product, product => product.productId)
    @JoinColumn({ name: "productId" })
    product: Product;
}
