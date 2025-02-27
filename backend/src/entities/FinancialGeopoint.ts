import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Category } from './Category';
import { TransactionType, GeoPoint } from '../types';

@Entity('financial_geopoints')
export class FinancialGeopoint {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({
        type: 'varchar',
        length: 20
    })
    type!: TransactionType;

    @Column({
        type: 'geography',
        spatialFeatureType: 'Point',
        srid: 4326
    })
    location!: GeoPoint;

    @Column('text', { nullable: true })
    address: string | null = null;

    @Column({ type: 'uuid' })
    category_id!: string;

    @Column({ type: 'uuid' })
    user_id!: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at!: Date;

    @ManyToOne(() => User, user => user.financialGeopoints)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category!: Category;

    constructor(partial: Partial<FinancialGeopoint> = {}) {
        Object.assign(this, partial);
    }
}