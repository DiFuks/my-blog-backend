import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Post } from '@entities/Post';

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    title: string;

    @OneToMany(() => Post, post => post.category)
    posts: Array<Post>;

    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
    })
    url: string;

    @CreateDateColumn({
        type: 'timestamp with time zone',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
    })
    updatedAt: Date;
}
