import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

import { PostTypes } from '@enum/PostTypes';
import { Category } from '@entities/Category';

export type PostContent = Array<{
  'type': PostTypes
  'content': string
}>;

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  description: string;

  @Column({
    type: 'json',
  })
  content: PostContent;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  url: string;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  isActive: boolean;

  @ManyToOne(() => Category, category => category.posts, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  category: Category;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt: Date;
}
