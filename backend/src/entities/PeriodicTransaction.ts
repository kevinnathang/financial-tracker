import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Category } from './Category';
import { FinancialGeopoint } from './FinancialGeopoint';
import { TransactionType, TransactionFrequency } from '../types';

@Entity('periodic_transactions')
export class PeriodicTransaction {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    user_id!: string;

    @Column()
    category_id!: string;

    @Column({ nullable: true })
    financial_geopoint_id: string | null = null;

    @Column('decimal', { precision: 12, scale: 2 })
    amount!: number;

    @Column({
        type: 'varchar',
        length: 20
    })
    type!: TransactionType;

    @Column({ type: 'text', nullable: true })
    description: string | null = null;

    @Column({
        type: 'varchar',
        length: 20
    })
    frequency!: TransactionFrequency;

    @Column({ type: 'date' })
    start_date!: Date; // Fixed typo: was 'start_dat'

    @Column({ type: 'date', nullable: true })
    end_date: Date | null = null;

    @Column({ type: 'date', nullable: true })
    last_processed_date: Date | null = null;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at!: Date;

    @ManyToOne(() => User, user => user.periodicTransactions)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Category, category => category.periodicTransactions)
    @JoinColumn({ name: 'category_id' })
    category!: Category;

    @ManyToOne(() => FinancialGeopoint)
    @JoinColumn({ name: 'financial_geopoint_id' })
    financialGeopoint!: FinancialGeopoint;
}