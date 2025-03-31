// src/hooks/transactionQueries.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import transactionService, { 
  TransactionPayload, 
  TransactionListResponse,
  MonthlyStats
} from '../services/transactionService';

// Query keys
export const TRANSACTION_KEYS = {
  all: ['transactions'] as const,
  lists: () => [...TRANSACTION_KEYS.all, 'list'] as const,
  list: (filters: any) => [...TRANSACTION_KEYS.lists(), filters] as const,
  stats: () => [...TRANSACTION_KEYS.all, 'stats'] as const,
};

// Get transactions with optional filtering
export const useTransactions = () => {
  return useQuery<TransactionListResponse, Error>(
    TRANSACTION_KEYS.lists(),
    transactionService.getTransactions
  );
};

// Get monthly stats for dashboard
export const useMonthlyStats = () => {
  return useQuery<MonthlyStats, Error>(
    TRANSACTION_KEYS.stats(),
    transactionService.getMonthlyStats
  );
};

// Create a new transaction
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, TransactionPayload>(
    (transaction) => transactionService.createTransaction(transaction),
    {
      // When a transaction is created, invalidate relevant queries
      onSuccess: () => {
        // Invalidate the transaction list
        queryClient.invalidateQueries(TRANSACTION_KEYS.lists());
        
        // Invalidate monthly stats
        queryClient.invalidateQueries(TRANSACTION_KEYS.stats());
      }
    }
  );
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>(
    async (transactionId) => {
      console.log(`QUERY - Attempting to delete transaction with ID: ${transactionId}`);
      const response = await transactionService.deleteTransaction(transactionId);
      console.log(`QUERY - Transaction ${transactionId} deleted successfully`);
      return response;
    },
    {
      // When a transaction is deleted, invalidate relevant queries
      onSuccess: () => {
        console.log('QUERY - Delete transaction successful, invalidating queries...');
        queryClient.invalidateQueries(TRANSACTION_KEYS.lists());
        queryClient.invalidateQueries(TRANSACTION_KEYS.stats());
      },
      onError: (error, transactionId) => {
        console.error(`QUERY - Error deleting transaction with ID: ${transactionId}`, error);
      },
      onSettled: () => {
        console.log('QUERY - Delete transaction mutation settled (either success or failure).');
      }
    }
  );
};
