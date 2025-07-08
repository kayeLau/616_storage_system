import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class FoodOptions {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ comment: '0:可用 1:禁用 2:隐藏' })
    disable: number

    @Column()
    foodId: number

    @Column({ length: 50 })
    name: string

    @Column({ length: 20 })
    label: string

    @Column()
    value: number

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createDate: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateDate: Date;
}
