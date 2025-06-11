import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  TrendingUp,
  TrendingDown,
  CreditCard as Edit3,
  Trash2,
} from 'lucide-react-native';
import { Asset } from '@/types';

interface Props {
  asset: Asset;
  onEdit?: (asset: Asset) => void;
  onDelete?: (asset: Asset) => void;
}

export const AssetCard: React.FC<Props> = ({ asset, onEdit, onDelete }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getAssetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      cash: 'Cash',
      bank_account: 'Bank Account',
      investment: 'Investment',
      crypto: 'Cryptocurrency',
      real_estate: 'Real Estate',
      vehicle: 'Vehicle',
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

  const getAssetIcon = (type: string) => {
    const isPositive = asset.currentValue >= 0;
    return isPositive ? (
      <TrendingUp size={20} color={getAssetTypeColor(type)} />
    ) : (
      <TrendingDown size={20} color="#dc2626" />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.assetInfo}>
          <View style={styles.iconContainer}>{getAssetIcon(asset.type)}</View>
          <View style={styles.details}>
            <Text style={styles.name}>{asset.name}</Text>
            <Text style={styles.type}>{getAssetTypeLabel(asset.type)}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(asset)}
            >
              <Edit3 size={18} color="#6b7280" />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete(asset)}
            >
              <Trash2 size={18} color="#dc2626" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.valueContainer}>
        <Text style={styles.value}>{formatCurrency(asset.currentValue)}</Text>
        <View
          style={[
            styles.indicator,
            { backgroundColor: getAssetTypeColor(asset.type) },
          ]}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.lastUpdated}>
          Updated {new Date(asset.updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
