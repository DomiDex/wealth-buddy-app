import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData';
import { NetWorthCard } from '@/features/dashboard/components/NetWorthCard';
import { QuickStatsCard } from '@/features/dashboard/components/QuickStatsCard';
import { RecentTransactions } from '@/features/dashboard/components/RecentTransactions';
import { AssetBreakdown } from '@/features/dashboard/components/AssetBreakdown';

export default function DashboardScreen() {
  const { data, isLoading, refetch } = useDashboardData();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.title}>Financial Overview</Text>
        </View>

        <NetWorthCard 
          netWorth={data?.netWorth || 0}
          change={data?.netWorthChange || 0}
          changePercent={data?.netWorthChangePercent || 0}
        />

        <View style={styles.statsRow}>
          <QuickStatsCard
            title="Total Assets"
            value={data?.totalAssets || 0}
            type="assets"
          />
          <QuickStatsCard
            title="Total Debts"
            value={data?.totalDebts || 0}
            type="debts"
          />
        </View>

        <AssetBreakdown assets={data?.assetBreakdown || []} />
        
        <RecentTransactions transactions={data?.recentTransactions || []} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
});