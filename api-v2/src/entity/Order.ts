import { Entity, PrimaryGeneratedColumn, Column ,ManyToOne, JoinColumn} from "typeorm"
import { Shop } from "./Shop"

@Entity()
export class Order {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ length: 50 })
    orderCode: string

    @Column({ length: 36 })
    orderUserId: string

    @Column({ length: 50 })
    orderUserName: string

    @Column({ length: 36 })
    orderShopId: string

    @Column({comment: '所属部門'})
    department: number
    
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createDate: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateDate: Date;

    @Column('date')
    orderDate: Date

    @Column()
    orderIndex: number

    @Column({comment: '0:未分配 1:已分配'})
    state: number

    @ManyToOne(() => Shop)
    @JoinColumn({ name: "orderShopId", referencedColumnName: "shopId" }) // Join on a different column
    shop: Shop;
}
