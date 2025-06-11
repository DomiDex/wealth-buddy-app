import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDatabaseContext } from '@/services/local-db/DatabaseProvider';
import {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
} from '@/services/local-db/queries';
import { CreateAssetInput } from '@/types';

export const useAssets = () => {
  const { db, isReady } = useDatabaseContext();

  return useQuery({
    queryKey: ['assets'],
    queryFn: () => {
      if (!db) throw new Error('Database not ready');
      return getAssets(db);
    },
    enabled: isReady && !!db,
  });
};

export const useCreateAsset = () => {
  const { db } = useDatabaseContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAssetInput) => {
      if (!db) throw new Error('Database not ready');
      return createAsset(db, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateAsset = () => {
  const { db } = useDatabaseContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<CreateAssetInput>;
    }) => {
      if (!db) throw new Error('Database not ready');
      return updateAsset(db, id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteAsset = () => {
  const { db } = useDatabaseContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!db) throw new Error('Database not ready');
      return deleteAsset(db, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
