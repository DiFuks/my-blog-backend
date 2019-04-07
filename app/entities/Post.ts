import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { PostTypes } from '@enum/PostTypes';

export type PostContent = Array<{
  'type' : PostTypes
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
  menuTitle: string;

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

  @CreateDateColumn({
    type: 'time with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'time with time zone',
  })
  updatedAt: Date;
}
