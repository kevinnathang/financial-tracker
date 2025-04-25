// src/services/transactionService.ts
import api from './api';
import { Transaction } from '../types';

export const transactionService = {
  createTransaction: async (transaction: Transaction.TransactionPayload) => {
    try {
      const response = await api.post('/transactions', transaction);
      return response.data;
    } catch (error) {
      console.error('SERVICE - Error in createTransaction:', error);
      throw error; 
    }
  },
  
  getAllTransactions: async () => {
    try {
      const response = await api.get('/transactions');
      return response.data;
    } catch (error) {
      console.error('SERVICE - Error in getAllTransactions:', error);
      throw error; 
    }
  },
  
  getMonthlyStats: async (): Promise<Transaction.MonthlyStats> => {
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

  updateTransaction: async (transactionId: string, transactionData: Transaction.TransactionPayload): Promise<any> => {
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