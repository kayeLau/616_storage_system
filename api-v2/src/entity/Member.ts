import { Entity, PrimaryGeneratedColumn, Column , OneToOne , JoinColumn, ManyToOne } from "typeorm"
import { Partition } from "./Partition"
import { Shop } from "./Shop"

@Entity()
export class Member {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ length: 20 })
    name: string

    @Column()
    password: string

    @Column()
    auth: number

    @Column({ nullable: true })
    shopPartition: number

    @Column({ nullable: true , length:36 })
    shopId: String

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createDate: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateDate: Date;

    @Column({ nullable: true })
    online: number

    @Column({ nullable: true , length: 50 })
    ipAddress: string

    @OneToOne(() => Partition)
    @JoinColumn({ name: "shopPartition", referencedColumnName: "id" })
    partition: Partition;

    @ManyToOne(() => Shop)
    @JoinColumn({ name: "shopId", referencedColumnName: "shopId" })
    shop: Shop;
}
