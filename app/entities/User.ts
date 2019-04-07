import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    email: string;

    @Column({
        type: 'varchar',
        nullable: true,
        length: 255,
    })
    password: string;

    @CreateDateColumn({
        type: 'time with time zone'
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'time with time zone'
    })
    updatedAt: Date;
}
