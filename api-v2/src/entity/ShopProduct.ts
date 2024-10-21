import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity()
export class ShopProduct {

    @PrimaryColumn({ type: 'varchar', length: 50 })
    id: string;

    @Column({length: 36})
    shopId: string

    @Column()
    productId: number

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createDate: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateDate: Date
}
