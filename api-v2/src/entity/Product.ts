import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    productId: number

    @Column()
    productCode: string

    @Column()
    department: number

    @Column()
    freezersNum: number

    @Column()
    classify: number

    @Column()
    productName: string

    @Column()
    unit: string

    @Column()
    standard: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createDate: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateDate: Date;

    @Column()
    disable: number

    @Column()
    summary: number

    @Column()
    prompt: number
}
