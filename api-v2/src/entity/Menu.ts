import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Menu {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ comment: '0:可用 1:禁用 2:隐藏' })
    disable: number

    @Column({ default: 0 })
    comboId: number

    @Column({ default: 0 , comment: '0:一般 1:套餐 2:加配' })
    classify: number

    @Column({ comment: '口味選擇' , nullable:true })
    options: string

    @Column({ length: 20 , nullable:true })
    foodCode: string

    @Column()
    price: number

    @Column({ length: 50 })
    name: string

    @Column({ length: 20 })
    introduce: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createDate: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateDate: Date;
}
