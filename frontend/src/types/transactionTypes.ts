export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface Transaction {
    id: string;
    user_id: string;
    tag_id: string | null;
    financial_geopoint_id: string | null;
    amount: number;
    type: string;
    description: string | null;
    date: string;
    created_at: string;
    tag?: {
        id: string;
        name: string;
        icon: string | null;
        color: string;
        user_id: string;
    };
    financialGeopoint?: {
        id: string;
        name: string;
        type: string;
        location: any;
        address: string | null;
        user_id: string;
    };
}

export interface TransactionListResponse {
    transactions: Transaction[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
    };
}

export interface MonthlyStats {
    currentMonth: {
        income: number;
        expenses: number;
        balance: number;
    };
    previousMonth: {
        income: number;
        expenses: number;
        balance: number;
    };
    percentageChanges: {
        income: number;
        expenses: number;
        balance: number;
    };
}

export interface TransactionPayload {
    tag_id?: string;
    financial_geopoint_id?: string;
    amount: number;
    type: 'income' | 'expense';
    description?: string;
    date?: Date;
}

export interface UpdateTransactionPayload extends TransactionPayload {
    transactionId: string;
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

export interface GeoPoint {
    type: 'Point';
    coordinates: [number, number];
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