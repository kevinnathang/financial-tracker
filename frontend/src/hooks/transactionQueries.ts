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
  return useQuery<TransactionListResponse, Error>(
    TRANSACTION_KEYS.lists(),
    transactionService.getTransactions
  );
};

export const useMonthlyStats = () => {
  return useQuery<MonthlyStats, Error>(
    TRANSACTION_KEYS.stats(),
    transactionService.getMonthlyStats
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

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, UpdateTransactionPayload>(
    async ({ transactionId, ...transactionData }) => {
      console.log(`QUERY - Attempting to update transaction with ID: ${transactionId}`);
      const response = await transactionService.updateTransaction(transactionId, transactionData);
      console.log(`QUERY - Transaction ${transactionId} updated successfully`);
      return response;
    },
    {
      onSuccess: () => {
        console.log('QUERY - Update transaction successful, invalidating queries...');
        queryClient.invalidateQueries(TRANSACTION_KEYS.lists());
        queryClient.invalidateQueries(TRANSACTION_KEYS.stats());
      },
      onError: (error, { transactionId }) => {
        console.error(`QUERY - Error Updating transaction with ID: ${transactionId}`, error);
      },
      onSettled: () => {
        console.log('QUERY - Update transaction mutation settled (either success or failure).');
      }
    }
  );
};
