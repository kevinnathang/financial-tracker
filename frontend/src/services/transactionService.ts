// src/services/transactionService.ts
import api from './api';

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

export const transactionService = {
  // Create a new transaction
  createTransaction: async (transaction: TransactionPayload) => {
    const response = await api.post('/transactions', transaction);
    return response.data;
  },
  
  // Get user transactions with optional filters
  getTransactions: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },
  
  // Get monthly transaction statistics for the dashboard
  getMonthlyStats: async (): Promise<MonthlyStats> => {
    const response = await api.get('/transactions/monthly-stats');
    return response.data;
  }
};

export default transactionService;