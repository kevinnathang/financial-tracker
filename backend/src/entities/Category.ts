import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Transaction } from './Transaction';
import { PeriodicTransaction } from './PeriodicTransaction';
import { TransactionType } from '../types';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({
        type: 'varchar',
        length: 20
    })
    type!: TransactionType;

    @Column({ type: 'varchar', nullable: true })
    icon: string | null = null;

    @Column({ type: 'varchar', length: 7, nullable: true })
    color: string | null = null;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at!: Date;

    @OneToMany(() => Transaction, transaction => transaction.category)
    transactions!: Transaction[];

    @OneToMany(() => PeriodicTransaction, periodicTransaction => periodicTransaction.category)
    periodicTransactions!: PeriodicTransaction[];
}