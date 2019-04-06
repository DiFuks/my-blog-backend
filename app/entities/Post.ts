import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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
    type: 'text',
  })
  content: string;

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
