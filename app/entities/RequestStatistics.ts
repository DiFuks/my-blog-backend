import { Entity, PrimaryGeneratedColumn, Column, Generated, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class RequestStatistics {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid', {
        nullable: true
    })
    @Generated('uuid')
    sessionId: string;

    @Column('text', {
        nullable: true
    })
    url: string;

    @Column('text', {
        nullable: true
    })
    requestBody: string;

    @Column('json', {
        nullable: true
    })
    requestHeaders: object;

    @Column({
        type: 'varchar',
        default: 'get',
        nullable: true
    })
    requestMethod: string;

    @Column('json', {
        nullable: true
    })
    responseBody: object;

    @Column('smallint', {
        nullable: true
    })
    responseCode: number;

    @Column('json', {
        nullable: true
    })
    responseHeaders: object;

    @CreateDateColumn({
        type: 'time with time zone'
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'time with time zone'
    })
    updatedAt: Date;
}
