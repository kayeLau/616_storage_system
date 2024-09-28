import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class ShopProduct {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    shopId: string

    @Column()
    productId: number

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createDate: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateDate: Date
}
