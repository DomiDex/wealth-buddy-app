import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowRightLeft,
  CreditCard as Edit3,
  Trash2,
} from 'lucide-react-native';
import { Transaction } from '@/types';

interface Props {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

export const TransactionCard: React.FC<Props> = ({
  transaction,
  onEdit,
  onDelete,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year:
          date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowUpRight size={20} color="#059669" />;
      case 'expense':
        return <ArrowDownRight size={20} color="#dc2626" />;
      case 'transfer':
        return <ArrowRightLeft size={20} color="#3b82f6" />;
      default:
        return <ArrowRightLeft size={20} color="#6b7280" />;
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

  const getTransactionSign = (type: string) => {
    switch (type) {
      case 'income':
        return '+';
      case 'expense':
        return '-';
      case 'transfer':
        return '';
      default:
        return '';
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      income: 'Income',
      expense: 'Expense',
      transfer: 'Transfer',
    };
    return labels[type] || type;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.transactionInfo}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${getTransactionColor(transaction.type)}15` },
            ]}
          >
            {getTransactionIcon(transaction.type)}
          </View>
          <View style={styles.details}>
            <Text style={styles.description}>{transaction.description}</Text>
            <View style={styles.metadata}>
              <Text style={styles.type}>
                {getTransactionTypeLabel(transaction.type)}
              </Text>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.date}>{formatDate(transaction.date)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text
            style={[
              styles.amount,
              { color: getTransactionColor(transaction.type) },
            ]}
          >
            {getTransactionSign(transaction.type)}
            {formatCurrency(transaction.amount)}
          </Text>
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onEdit(transaction)}
              >
                <Edit3 size={16} color="#6b7280" />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => onDelete(transaction)}
              >
                <Trash2 size={16} color="#dc2626" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  separator: {
    fontSize: 12,
    color: '#d1d5db',
    marginHorizontal: 6,
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
  },
});
