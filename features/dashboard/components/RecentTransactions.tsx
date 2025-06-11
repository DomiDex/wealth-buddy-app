import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '@/types';
import { ArrowUpRight, ArrowDownRight, ArrowRightLeft } from 'lucide-react-native';

interface Props {
  transactions: Transaction[];
}

export const RecentTransactions: React.FC<Props> = ({ transactions }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowUpRight size={16} color="#059669" />;
      case 'expense':
        return <ArrowDownRight size={16} color="#dc2626" />;
      case 'transfer':
        return <ArrowRightLeft size={16} color="#3b82f6" />;
      default:
        return <ArrowRightLeft size={16} color="#6b7280" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'income':
        return '#059669';
      case 'expense':
        return '#dc2626';
      case 'transfer':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  if (!transactions.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recent Transactions</Text>
        <Text style={styles.emptyText}>No transactions yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Transactions</Text>
      {transactions.map((transaction) => (
        <View key={transaction.id} style={styles.transactionRow}>
          <View style={styles.iconContainer}>
            {getTransactionIcon(transaction.type)}
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.description}>{transaction.description}</Text>
            <Text style={styles.date}>{formatDate(transaction.date)}</Text>
          </View>
          <Text style={[styles.amount, { color: getTransactionColor(transaction.type) }]}>
            {transaction.type === 'expense' ? '-' : '+'}
            {formatCurrency(transaction.amount)}
          </Text>
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
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 20,
  },
});