import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Setting {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    value: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateDate: Date;
}
