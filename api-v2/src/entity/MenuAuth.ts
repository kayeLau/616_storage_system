import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class MenuAuth {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ comment: '-1:管理 0:廚房 1:樓面 2:區經 3:工埸' })
    auth: string

    @Column({ length: 50 })
    name: string

    @Column({ length: 50 })
    path: string

    @Column({ default: 0 })
    parentId: number

    @Column({ comment: '類型' })
    type: number

    @Column({ comment: '序號' })
    index: number

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createDate: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateDate: Date;
}
