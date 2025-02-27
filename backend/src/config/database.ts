// src/config/database.ts
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Category } from '../entities/Category';
import { FinancialGeopoint } from '../entities/FinancialGeopoint';
import { Transaction } from '../entities/Transaction';
import { PeriodicTransaction } from '../entities/PeriodicTransaction';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'finance_user',
    password: process.env.DB_PASSWORD || 'finance_password',
    database: process.env.DB_NAME || 'finance_db',
    synchronize: process.env.NODE_ENV === 'development', // Be careful with this in production
    logging: process.env.NODE_ENV === 'development',
    entities: [User, Category, FinancialGeopoint, Transaction, PeriodicTransaction],
    subscribers: [],
    migrations: ['src/migrations/*.ts'],
});