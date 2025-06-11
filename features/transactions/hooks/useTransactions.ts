import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDatabaseContext } from '@/services/local-db/DatabaseProvider';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '@/services/local-db/queries';
import { CreateTransactionInput } from '@/types';

export const useTransactions = (limit = 50) => {
  const { db, isReady } = useDatabaseContext();

  return useQuery({
    queryKey: ['transactions', limit],
    queryFn: () => {
      if (!db) throw new Error('Database not ready');
      return getTransactions(db, limit);
    },
    enabled: isReady && !!db,
  });
};

export const useCreateTransaction = () => {
  const { db } = useDatabaseContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTransactionInput) => {
      if (!db) throw new Error('Database not ready');
      return createTransaction(db, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateTransaction = () => {
  const { db } = useDatabaseContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<CreateTransactionInput>;
    }) => {
      if (!db) throw new Error('Database not ready');
      return updateTransaction(db, id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteTransaction = () => {
  const { db } = useDatabaseContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!db) throw new Error('Database not ready');
      return deleteTransaction(db, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
