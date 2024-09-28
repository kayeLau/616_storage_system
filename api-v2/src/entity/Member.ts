import { Entity, PrimaryGeneratedColumn, Column , OneToOne , JoinColumn } from "typeorm"
import { Partition } from "./Partition"

@Entity()
export class Member {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column()
    password: string

    @Column()
    auth: number

    @Column({ nullable: true })
    shopPartition: number

    @Column({ nullable: true })
    shopId: String
    

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    craetDate: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateDate: Date;

    @Column()
    online: number

    @Column({ nullable: true })
    ipAddress: string

    @OneToOne(() => Partition)
    @JoinColumn({ name: "shopPartition", referencedColumnName: "id" }) // Join on a different column
    partition: Partition;
}
