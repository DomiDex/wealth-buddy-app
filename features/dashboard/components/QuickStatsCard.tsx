import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface Props {
  title: string;
  value: number;
  type: 'assets' | 'debts';
}

export const QuickStatsCard: React.FC<Props> = ({ title, value, type }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const isAssets = type === 'assets';

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <View style={styles.iconContainer}>
        {isAssets ? (
          <TrendingUp size={20} color="#059669" />
        ) : (
          <TrendingDown size={20} color="#dc2626" />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color: isAssets ? '#059669' : '#dc2626' }]}>
        {formatCurrency(value)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
  },
});
