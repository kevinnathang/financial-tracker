import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Category } from './Category';
import { FinancialGeopoint } from './FinancialGeopoint';
import { TransactionType } from '../types';

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    user_id!: string;

    @Column({ type: 'uuid' })
    category_id!: string;

    @Column({ type: 'uuid', nullable: true })
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

    @Column({ type: 'timestamp with time zone' })
    date!: Date;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at!: Date;

    @ManyToOne(() => User, user => user.transactions)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Category, category => category.transactions)
    @JoinColumn({ name: 'category_id' })
    category!: Category;

    @ManyToOne(() => FinancialGeopoint)
    @JoinColumn({ name: 'financial_geopoint_id' })
    financialGeopoint!: FinancialGeopoint;
}