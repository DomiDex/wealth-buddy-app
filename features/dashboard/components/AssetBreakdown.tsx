import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AssetBreakdownItem } from '@/types';

interface Props {
  assets: AssetBreakdownItem[];
}

export const AssetBreakdown: React.FC<Props> = ({ assets }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getAssetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      cash: 'Cash',
      bank_account: 'Bank Accounts',
      investment: 'Investments',
      crypto: 'Cryptocurrency',
      real_estate: 'Real Estate',
      vehicle: 'Vehicles',
      other: 'Other',
    };
    return labels[type] || type;
  };

  const getAssetTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      cash: '#10b981',
      bank_account: '#3b82f6',
      investment: '#8b5cf6',
      crypto: '#f59e0b',
      real_estate: '#ef4444',
      vehicle: '#6b7280',
      other: '#9ca3af',
    };
    return colors[type] || '#9ca3af';
  };

  if (!assets.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Asset Breakdown</Text>
        <Text style={styles.emptyText}>No assets to display</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asset Breakdown</Text>
      {assets.map((asset) => (
        <View key={asset.type} style={styles.assetRow}>
          <View style={styles.assetInfo}>
            <View style={[styles.indicator, { backgroundColor: getAssetTypeColor(asset.type) }]} />
            <Text style={styles.assetName}>{getAssetTypeLabel(asset.type)}</Text>
          </View>
          <View style={styles.assetValue}>
            <Text style={styles.value}>{formatCurrency(asset.value)}</Text>
            <Text style={styles.percentage}>{asset.percentage.toFixed(1)}%</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  assetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  assetName: {
    fontSize: 16,
    color: '#374151',
  },
  assetValue: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  percentage: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 20,
  },
});