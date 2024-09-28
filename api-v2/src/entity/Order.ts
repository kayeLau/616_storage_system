import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id: string

    @Column()
    orderCode: string

    @Column()
    orderUserId: string

    @Column()
    orderUserName: number

    @Column()
    orderShopId: number

    @Column()
    department: number
    
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    craetDate: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateDate: Date;

    @Column('date')
    orderDate: Date

    @Column()
    orderIndex: number

    @Column()
    state: string
}
