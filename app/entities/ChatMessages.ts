import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

import { ChatMessageTypes } from '@enum/ChatMessageTypes';
import { SocketConnections } from '@entities/SocketConnections';

export interface IMessage {
  type: ChatMessageTypes;

  date: Date;

  message: string;
}

@Entity()
export class ChatMessages {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'json',
  })
  messages: Array<IMessage> = [];

  @OneToMany(() => SocketConnections, socketConnection => socketConnection.chat)
  socketConnections: Promise<Array<SocketConnections>>;

  @CreateDateColumn({
    type: 'time with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'time with time zone',
  })
  updatedAt: Date;
}
