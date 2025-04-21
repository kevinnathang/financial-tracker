// src/hooks/budgetQueries.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import budgetService, {
  BudgetListResponse,
  BudgetPayload,
  UpdateBudgetPayload
} from '../services/budgetService';

export const BUDGET_KEYS = {
  all: ['budgets'] as const,
  lists: () => [...BUDGET_KEYS.all, 'list'] as const,
};

export const useBudgets = () => {
  return useQuery<BudgetListResponse, Error>(
    BUDGET_KEYS.lists(),
    budgetService.getAllBudgets,
    {
      staleTime: 5 * 60 * 1000, 
      retry: 2
    }
  );
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, BudgetPayload>(
    (budget) => budgetService.createBudget(budget),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(BUDGET_KEYS.lists());
        queryClient.invalidateQueries(BUDGET_KEYS.all);

      },
      onError: (error) => {
        console.error(`QUERY - Error using useCreateBudget. ${error}`);
      },
    }
  );
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>(
    async (budgetId) => {
      const response = await budgetService.deleteBudget(budgetId);
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(BUDGET_KEYS.lists());
        queryClient.invalidateQueries(BUDGET_KEYS.all);
        queryClient.invalidateQueries('userData');
        queryClient.invalidateQueries('transactions')

      },
      onError: (error, budgetId) => {
        console.error(`QUERY - Error deleting budget with ID: ${budgetId}`);
      },
    }
  );
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, UpdateBudgetPayload>(
    async ({ budgetId, ...budgetData }) => {
      const response = await budgetService.updateBudget(budgetId, budgetData);
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(BUDGET_KEYS.lists());
        queryClient.invalidateQueries(BUDGET_KEYS.all);
        queryClient.invalidateQueries('userData');
        queryClient.invalidateQueries('transactions')
      },
      onError: (error, { budgetId }) => {
        console.error(`QUERY - Error Updating budget with ID: ${budgetId}`);
      },
    }
  );
};