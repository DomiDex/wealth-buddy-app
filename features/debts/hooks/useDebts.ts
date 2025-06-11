import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDatabaseContext } from '@/services/local-db/DatabaseProvider';
import { getDebts, createDebt, updateDebt, deleteDebt } from '@/services/local-db/queries';
import { CreateDebtInput } from '@/types';

export const useDebts = () => {
  const { db, isReady } = useDatabaseContext();

  return useQuery({
    queryKey: ['debts'],
    queryFn: () => {
      if (!db) throw new Error('Database not ready');
      return getDebts(db);
    },
    enabled: isReady && !!db,
  });
};

export const useCreateDebt = () => {
  const { db } = useDatabaseContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDebtInput) => {
      if (!db) throw new Error('Database not ready');
      return createDebt(db, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateDebt = () => {
  const { db } = useDatabaseContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CreateDebtInput> }) => {
      if (!db) throw new Error('Database not ready');
      return updateDebt(db, id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteDebt = () => {
  const { db } = useDatabaseContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!db) throw new Error('Database not ready');
      return deleteDebt(db, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};