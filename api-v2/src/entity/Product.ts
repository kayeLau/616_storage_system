import { Entity, PrimaryGeneratedColumn, Column , OneToMany} from "typeorm"

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    productId: number

    @Column({length: 20})
    productCode: string

    @Column()
    department: number

    @Column()
    freezersNum: number

    @Column()
    classify: number

    @Column({length: 50})
    productName: string

    @Column({length: 20})
    unit: string

    @Column({length: 50})
    standard: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createDate: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateDate: Date;

    @Column({comment:'0:可用 1:禁用 2:隐藏'})
    disable: number

    @Column({comment:'0:否 1:是'})
    summary: number

    @Column({comment:'0:否 1:是'})
    prompt: number
}
