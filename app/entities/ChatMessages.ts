import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ChatMessages {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'json',
    })
    messages = [];

    @Column({
        type: 'varchar',
    })
    name: string;

    @CreateDateColumn({
        type: 'time with time zone',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'time with time zone',
    })
    updatedAt: Date;
}
