import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { ChatMessageTypes } from '@enum/ChatMessageTypes';

export interface IMessage {
    type: ChatMessageTypes;

    date: Date;

    text: string;
}

@Entity()
export class ChatMessages {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'json',
    })
    messages: Array<IMessage> = [];

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
