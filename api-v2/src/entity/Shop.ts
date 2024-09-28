import { Entity, PrimaryGeneratedColumn, Column , ManyToOne , JoinColumn } from "typeorm"
import { Partition } from "./Partition"

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
}
