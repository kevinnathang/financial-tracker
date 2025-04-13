// src/services/budgetService.ts
import api from './api';

export interface Budget {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  period: string | null;
  start_date: string | null;
  end_date: string | null;
  is_main: boolean;
  description: string | null;
}

export interface BudgetListResponse {
  budgets: Budget[];
}

export interface BudgetPayload {
    name: string;
    amount: number;
    period: string | null;
    start_date: Date | null;
    end_date: Date | null;
    is_main: boolean;
    description: string | null;
}

export interface CreateBudgetResponse {
  message: string;
  budget: Budget;
}

export interface UpdateBudgetPayload extends BudgetPayload {
  budgetId: string;
}

export const budgetService = {
    createBudget: async (budget: BudgetPayload): Promise<CreateBudgetResponse> => {
    try {
      const response = await api.post('/budget', budget);
      return response.data;
    } catch (error) {
      console.error('SERVICE - Error in createBudget:', error);
      throw error; 
    }
  },

  getBudget: async (budgetId: string): Promise<Budget> => {
    try {
        const response = await api.get(`/budget/${budgetId}`)
        return response.data
    } catch (error) {
        console.error('SERVICE - Error in getBudget:', error);
        throw error; 
    }
  },
  
  getBudgets: async (): Promise<BudgetListResponse> => {
    try {
      const response = await api.get('/budget');
      return response.data;
    } catch (error) {
      console.error('SERVICE - Error in getBudgets:', error);
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

  updateBudget: async(budgetId: string, budgetData: BudgetPayload): Promise<any> => {
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