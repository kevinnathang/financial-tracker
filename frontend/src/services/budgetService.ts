// src/services/budgetService.ts
import api from './api';
import { Budget } from '../types';

export const budgetService = {
    createBudget: async (budget: Budget.BudgetPayload): Promise<Budget.CreateBudgetResponse> => {
    try {
      const response = await api.post('/budget', budget);
      return response.data;
    } catch (error) {
      console.error('SERVICE - Error in createBudget:', error);
      throw error; 
    }
  },

  getBudget: async (budgetId: string): Promise<Budget.Budget> => {
    try {
        const response = await api.get(`/budget/${budgetId}`)
        return response.data
    } catch (error) {
        console.error('SERVICE - Error in getBudget:', error);
        throw error; 
    }
  },
  
  getAllBudgets: async (): Promise<Budget.BudgetListResponse> => {
    try {
      const response = await api.get('/budget');
      return response.data;
    } catch (error) {
      console.error('SERVICE - Error in getAllBudgets:', error);
      throw error; 
    }
  },

  deleteBudget: async(budgetId: string) => {
    try {
      const response = await api.delete(`/budget/${budgetId}`);
      return response.data
    } catch (error) {
      console.error('SERVICE - Error in deleteBudget:', error);
      throw error; 
    }
  },

  updateBudget: async(budgetId: string, budgetData: Budget.BudgetPayload): Promise<any> => {
    try {
      const response = await api.patch(`/budget/${budgetId}`, budgetData);
      return response.data
    } catch (error) {
      console.error('SERVICE - Error in updateBudget:', error);
      throw error;
    }
  }
};

export default budgetService;