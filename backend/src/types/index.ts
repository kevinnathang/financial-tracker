// backend/src/types/index.ts

export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface User {
    id: string;
    email: string;
    password_hash: string;
    balance: number;
    full_name: string;
    created_at: Date;
    updated_at: Date;
}

export interface Tag {
    id: string;
    name: string;
    icon?: string;
    color: string;
    created_at: Date;
}

export interface GeoPoint {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
}

export interface FinancialGeopoint {
    id: string;
    name: string;
    type: TransactionType;
    location: GeoPoint;
    address?: string;
    tag_id?: string;
    user_id: string;
    created_at: Date;
}

export interface Transaction {
    id: string;
    user_id: string;
    tag_id?: string;
    financial_geopoint_id?: string;
    amount: number;
    type: TransactionType;
    description?: string;
    date: Date;
    created_at: Date;
}

export interface PeriodicTransaction {
    id: string;
    user_id: string;
    tag_id?: string;
    financial_geopoint_id?: string;
    amount: number;
    type: TransactionType;
    description?: string;
    frequency: TransactionFrequency;
    start_date: Date;
    end_date?: Date;
    last_processed_date?: Date;
    created_at: Date;
    updated_at: Date;
}