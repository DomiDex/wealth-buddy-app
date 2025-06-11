import { useQuery } from '@tanstack/react-query';
import { useDatabaseContext } from '@/services/local-db/DatabaseProvider';
import { getDashboardData, getTransactions } from '@/services/local-db/queries';
import { DashboardData } from '@/types';

export const useDashboardData = () => {
  const { db, isReady } = useDatabaseContext();

  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async (): Promise<DashboardData> => {
      if (!db) throw new Error('Database not ready');

      const [dashboardData, recentTransactions] = await Promise.all([
        getDashboardData(db),
        getTransactions(db, 5),
      ]);

      return {
        ...dashboardData,
        recentTransactions,
      };
    },
    enabled: isReady && !!db,
    staleTime: 1000 * 60, // 1 minute
  });
};
