import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Transaction } from './Transaction';
import { PeriodicTransaction } from './PeriodicTransaction';
import { FinancialGeopoint } from './FinancialGeopoint';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', unique: true })
    email!: string;

    @Column({ type: 'varchar' })
    password_hash!: string;

    @Column({ type: 'varchar' })
    full_name!: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at!: Date;

    @OneToMany(() => Transaction, transaction => transaction.user)
    transactions!: Transaction[];

    @OneToMany(() => PeriodicTransaction, periodicTransaction => periodicTransaction.user)
    periodicTransactions!: PeriodicTransaction[];

    @OneToMany(() => FinancialGeopoint, financialGeopoint => financialGeopoint.user)
    financialGeopoints!: FinancialGeopoint[];
}