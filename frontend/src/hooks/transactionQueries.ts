// src/hooks/transactionQueries.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import transactionService  from '../services/transactionService';
import { Transaction } from '../types';

export const TRANSACTION_KEYS = {
  all: ['transactions'] as const,
  lists: () => [...TRANSACTION_KEYS.all, 'list'] as const,
  list: (filters: any) => [...TRANSACTION_KEYS.lists(), filters] as const,
  stats: () => [...TRANSACTION_KEYS.all, 'stats'] as const,
};

export const useTransactions = () => {

  return useQuery<Transaction.TransactionListResponse, Error>(
    TRANSACTION_KEYS.lists(),
    transactionService.getAllTransactions,
    {
      onError: (error) => {
        console.error(`QUERY - Error using useTransactions. ${error}`);
      },
    }
  );
};

export const useMonthlyStats = () => {

  return useQuery<Transaction.MonthlyStats, Error>(
    TRANSACTION_KEYS.stats(),
    transactionService.getMonthlyStats,
    {
      onError: (error) => {
        console.error(`QUERY - Error getting monthly status. ${error}`);
      },
    }
  );
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, Transaction.TransactionPayload>(
    (transaction) => transactionService.createTransaction(transaction),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(TRANSACTION_KEYS.lists());
        
        queryClient.invalidateQueries(TRANSACTION_KEYS.stats());

        queryClient.invalidateQueries('userData');
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
        queryClient.invalidateQueries('userData');
      },
      onError: (error, transactionId) => {
        console.error(`QUERY - Error deleting transaction with ID: ${transactionId}`);
      },
    }
  );
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, Transaction.UpdateTransactionPayload>(
    async ({ transactionId, ...transactionData }) => {
      const response = await transactionService.updateTransaction(transactionId, transactionData);
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(TRANSACTION_KEYS.lists());
        queryClient.invalidateQueries(TRANSACTION_KEYS.stats());
        queryClient.invalidateQueries('userData');
      },
      onError: (error, { transactionId }) => {
        console.error(`QUERY - Error Updating transaction with ID: ${transactionId}`);
      },
    }
  );
};
