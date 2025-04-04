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

export interface UpdateTransactionPayload extends TransactionPayload {
  transactionId: string;
}

export const transactionService = {
  createTransaction: async (transaction: TransactionPayload) => {
    try {
      const response = await api.post('/transactions', transaction);
      return response.data;
    } catch (error) {
      console.error('SERVICE - Error in createTransaction:', error);
      throw error; 
    }
  },
  
  getTransactions: async () => {
    try {
      const response = await api.get('/transactions');
      return response.data;
    } catch (error) {
      console.error('SERVICE - Error in getTransactions:', error);
      throw error; 
    }
  },
  
  getMonthlyStats: async (): Promise<MonthlyStats> => {
    try {
      const response = await api.get('/transactions/monthly-stats');
      return response.data;
    } catch (error) {
      console.error('SERVICE - Error in getMonthlyStats:', error);
      throw error; 
    }
  },

  deleteTransaction: async (transactionId: string) => {
    try {
      const response = await api.delete(`/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('SERVICE - Error in deleteTransaction:', error);
      throw error; 
    }
  },

  updateTransaction: async (transactionId: string, transactionData: TransactionPayload): Promise<any> => {
    try {
      const response = await api.patch(`/transactions/${transactionId}`, transactionData);
      return response.data
    } catch (error) {
      console.error('SERVICE - Error in updateTransaction:', error);
      throw error;
    }
  }
};

export default transactionService;