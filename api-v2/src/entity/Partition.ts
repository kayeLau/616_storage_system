import { Entity, PrimaryGeneratedColumn, Column , ManyToMany} from "typeorm"

@Entity()
export class Partition {

    @PrimaryGeneratedColumn()
    id: number

    @Column({length: 50})
    partitionName: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateDate: Date;

}