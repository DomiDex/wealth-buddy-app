import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Landmark, Edit3, Trash2 } from 'lucide-react-native';
import { Debt, DebtType } from '@/types';

interface Props {
  debt: Debt;
  onEdit?: (debt: Debt) => void;
  onDelete?: (debt: Debt) => void;
}

export const DebtCard: React.FC<Props> = ({ debt, onEdit, onDelete }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getDebtTypeLabel = (type: DebtType) => {
    const labels: Record<DebtType, string> = {
      car_loan: 'Car Loan',
      home_loan: 'Home Loan',
      personal_loan: 'Personal Loan',
      other: 'Other',
    };
    return labels[type] || type;
  };

  const getDebtTypeColor = (type: DebtType) => {
    const colors: Record<DebtType, string> = {
      home_loan: '#ef4444',
      car_loan: '#f59e0b',
      personal_loan: '#8b5cf6',
      other: '#6b7280',
    };
    return colors[type] || '#9ca3af';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.debtInfo}>
          <View style={styles.iconContainer}>
            <Landmark size={20} color={getDebtTypeColor(debt.type)} />
          </View>
          <View style={styles.details}>
            <Text style={styles.name}>{debt.name}</Text>
            <Text style={styles.type}>{getDebtTypeLabel(debt.type)}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(debt)}
            >
              <Edit3 size={18} color="#6b7280" />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete(debt)}
            >
              <Trash2 size={18} color="#dc2626" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.valueContainer}>
        <Text style={styles.valueLabel}>Current Balance</Text>
        <Text style={styles.value}>{formatCurrency(debt.currentBalance)}</Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.lastUpdated}>
          Updated {new Date(debt.updatedAt).toLocaleDateString()}
        </Text>
        {debt.interestRate && (
          <Text style={styles.interestRate}>
            {debt.interestRate.toFixed(2)}% APR
          </Text>
        )}
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
  debtInfo: {
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
    marginBottom: 12,
  },
  valueLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9ca3af',
  },
  interestRate: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
});