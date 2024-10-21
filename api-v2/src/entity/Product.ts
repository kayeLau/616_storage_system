import { Entity, PrimaryGeneratedColumn, Column , OneToMany} from "typeorm"
import { OrderDetail } from './OrderDetail';

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

    @Column()
    disable: number

    @Column()
    summary: number

    @Column()
    prompt: number
}
