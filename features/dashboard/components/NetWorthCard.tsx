import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface Props {
  netWorth: number;
  change: number;
  changePercent: number;
}

export const NetWorthCard: React.FC<Props> = ({ netWorth, change, changePercent }) => {
  const isPositive = change >= 0;
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Net Worth</Text>
      <Text style={styles.amount}>{formatCurrency(netWorth)}</Text>
      
      {change !== 0 && (
        <View style={styles.changeContainer}>
          {isPositive ? (
            <TrendingUp size={16} color="#059669" />
          ) : (
            <TrendingDown size={16} color="#dc2626" />
          )}
          <Text style={[styles.changeText, { color: isPositive ? '#059669' : '#dc2626' }]}>
            {formatCurrency(Math.abs(change))} ({Math.abs(changePercent).toFixed(1)}%)
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
  },
});