// src/hooks/transactionQueries.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import transactionService, { 
  TransactionPayload, 
  TransactionListResponse,
  MonthlyStats,
  UpdateTransactionPayload
} from '../services/transactionService';

export const TRANSACTION_KEYS = {
  all: ['transactions'] as const,
  lists: () => [...TRANSACTION_KEYS.all, 'list'] as const,
  list: (filters: any) => [...TRANSACTION_KEYS.lists(), filters] as const,
  stats: () => [...TRANSACTION_KEYS.all, 'stats'] as const,
};

export const useTransactions = () => {
  const queryClient = useQueryClient();

  return useQuery<TransactionListResponse, Error>(
    TRANSACTION_KEYS.lists(),
    transactionService.getTransactions,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(TRANSACTION_KEYS.lists());
        
        queryClient.invalidateQueries(TRANSACTION_KEYS.stats());
      },
      onError: (error) => {
        console.error(`QUERY - Error using useTransactions. ${error}`);
      },
    }
  );
};

export const useMonthlyStats = () => {
  const queryClient = useQueryClient();

  return useQuery<MonthlyStats, Error>(
    TRANSACTION_KEYS.stats(),
    transactionService.getMonthlyStats,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(TRANSACTION_KEYS.lists());
        
        queryClient.invalidateQueries(TRANSACTION_KEYS.stats());
      },
      onError: (error) => {
        console.error(`QUERY - Error getting monthly status. ${error}`);
      },
    }
  );
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, TransactionPayload>(
    (transaction) => transactionService.createTransaction(transaction),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(TRANSACTION_KEYS.lists());
        
        queryClient.invalidateQueries(TRANSACTION_KEYS.stats());
      },
      onError: (error) => {
        console.error(`QUERY - Error creating transaction. ${error}`);
      },
    }
  );
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>(
    async (transactionId) => {
      const response = await transactionService.deleteTransaction(transactionId);
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(TRANSACTION_KEYS.lists());
        queryClient.invalidateQueries(TRANSACTION_KEYS.stats());
      },
      onError: (error, transactionId) => {
        console.error(`QUERY - Error deleting transaction with ID: ${transactionId}`);
      },
    }
  );
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, UpdateTransactionPayload>(
    async ({ transactionId, ...transactionData }) => {
      const response = await transactionService.updateTransaction(transactionId, transactionData);
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(TRANSACTION_KEYS.lists());
        queryClient.invalidateQueries(TRANSACTION_KEYS.stats());
      },
      onError: (error, { transactionId }) => {
        console.error(`QUERY - Error Updating transaction with ID: ${transactionId}`);
      },
    }
  );
};
