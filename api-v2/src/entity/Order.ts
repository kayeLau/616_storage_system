import { Entity, PrimaryGeneratedColumn, Column ,ManyToOne, JoinColumn} from "typeorm"
import { Shop } from "./Shop"

@Entity()
export class Order {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    orderCode: string

    @Column()
    orderUserId: string

    @Column()
    orderUserName: string

    @Column()
    orderShopId: string

    @Column()
    department: number
    
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createDate: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateDate: Date;

    @Column('date')
    orderDate: Date

    @Column()
    orderIndex: number

    @Column()
    state: number

    @ManyToOne(() => Shop)
    @JoinColumn({ name: "orderShopId", referencedColumnName: "shopId" }) // Join on a different column
    shop: Shop;
}
