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

    @Column({comment: '下單數量'})
    orderQuantity: number

    @Column({nullable:true, comment: '分配數量'})
    assignQuantity: number

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateDate: Date

    @Column({comment: '0:前線 1:系統'})
    orderMode: number
    
    @Column({comment: '0:未分配 1:已分配'})
    status: number;

    @Column({nullable:true})
    remark: string;

    @Column({nullable:true})
    lastEditBy: string

    @ManyToOne(() => Product, product => product.productId)
    @JoinColumn({ name: "productId" })
    product: Product;
}
