import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { ChatMessages } from '@entities/ChatMessages';

@Entity()
export class SocketConnections {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        nullable: false,
        unique: true
    })
    socketId: string;

    @ManyToOne(() => ChatMessages, user => user.socketConnections, {
        onDelete: 'CASCADE'
    })
    chat: ChatMessages;

    @CreateDateColumn({
        type: 'timestamp with time zone'
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp with time zone'
    })
    updatedAt: Date;
}
