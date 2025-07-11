import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class TasteOptions {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ comment: '0:可用 1:禁用 2:隐藏' })
    disable: number

    @Column({ comment: '選項標識' })
    flag: number

    @Column({ length: 20 , comment: '選項總稱'})
    title: string

    @Column({ length: 20 , comment: '選項名稱'})
    label: string

    @Column()
    value: number

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createDate: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateDate: Date;
}
