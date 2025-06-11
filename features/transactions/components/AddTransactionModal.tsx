import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { X, DollarSign, Calendar, ChevronDown } from 'lucide-react-native';
import { useCreateTransaction } from '@/features/transactions/hooks/useTransactions';
import { useAssets } from '@/features/assets/hooks/useAssets';
import { useDebts } from '@/features/debts/hooks/useDebts';
import { TransactionType } from '@/types';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const TRANSACTION_TYPES: {
  value: TransactionType;
  label: string;
  color: string;
}[] = [
  { value: 'income', label: 'Income', color: '#059669' },
  { value: 'expense', label: 'Expense', color: '#dc2626' },
  { value: 'transfer', label: 'Transfer', color: '#3b82f6' },
];

export const AddTransactionModal: React.FC<Props> = ({ visible, onClose }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [showDebtPicker, setShowDebtPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createTransactionMutation = useCreateTransaction();
  const { data: assets } = useAssets();
  const { data: debts } = useDebts();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid positive number';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createTransactionMutation.mutateAsync({
        description: description.trim(),
        amount: Number(amount),
        type,
        date: new Date(date).toISOString(),
        assetId: selectedAssetId,
        debtId: selectedDebtId,
      });

      // Reset form
      setDescription('');
      setAmount('');
      setType('expense');
      setDate(new Date().toISOString().split('T')[0]);
      setSelectedAssetId(null);
      setSelectedDebtId(null);
      setErrors({});
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create transaction. Please try again.');
    }
  };

  const handleClose = () => {
    setDescription('');
    setAmount('');
    setType('expense');
    setDate(new Date().toISOString().split('T')[0]);
    setSelectedAssetId(null);
    setSelectedDebtId(null);
    setErrors({});
    onClose();
  };

  const getSelectedAssetName = () => {
    if (!selectedAssetId) return 'Select Asset (Optional)';
    const asset = assets?.find((a) => a.id === selectedAssetId);
    return asset ? asset.name : 'Select Asset (Optional)';
  };

  const getSelectedDebtName = () => {
    if (!selectedDebtId) return 'Select Debt (Optional)';
    const debt = debts?.find((d) => d.id === selectedDebtId);
    return debt ? debt.name : 'Select Debt (Optional)';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Transaction</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>Transaction Type</Text>
            <View style={styles.typeContainer}>
              {TRANSACTION_TYPES.map((transactionType) => (
                <TouchableOpacity
                  key={transactionType.value}
                  style={[
                    styles.typeButton,
                    type === transactionType.value && {
                      backgroundColor: transactionType.color,
                      borderColor: transactionType.color,
                    },
                  ]}
                  onPress={() => setType(transactionType.value)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === transactionType.value &&
                        styles.typeButtonTextActive,
                    ]}
                  >
                    {transactionType.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, errors.description && styles.inputError]}
              value={description}
              onChangeText={setDescription}
              placeholder="e.g., Grocery shopping, Salary, Coffee"
              placeholderTextColor="#9ca3af"
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Amount</Text>
            <View
              style={[
                styles.inputContainer,
                errors.amount && styles.inputError,
              ]}
            >
              <DollarSign size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.inputWithIcon}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
            </View>
            {errors.amount && (
              <Text style={styles.errorText}>{errors.amount}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Date</Text>
            <View
              style={[styles.inputContainer, errors.date && styles.inputError]}
            >
              <Calendar size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.inputWithIcon}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9ca3af"
              />
            </View>
            {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Link to Asset</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowAssetPicker(!showAssetPicker)}
            >
              <Text style={styles.pickerButtonText}>
                {getSelectedAssetName()}
              </Text>
              <ChevronDown size={20} color="#6b7280" />
            </TouchableOpacity>
            {showAssetPicker && (
              <View style={styles.pickerContainer}>
                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => {
                    setSelectedAssetId(null);
                    setShowAssetPicker(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>None</Text>
                </TouchableOpacity>
                {assets?.map((asset) => (
                  <TouchableOpacity
                    key={asset.id}
                    style={styles.pickerItem}
                    onPress={() => {
                      setSelectedAssetId(asset.id);
                      setShowAssetPicker(false);
                    }}
                  >
                    <Text style={styles.pickerItemText}>{asset.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Link to Debt</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowDebtPicker(!showDebtPicker)}
            >
              <Text style={styles.pickerButtonText}>
                {getSelectedDebtName()}
              </Text>
              <ChevronDown size={20} color="#6b7280" />
            </TouchableOpacity>
            {showDebtPicker && (
              <View style={styles.pickerContainer}>
                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => {
                    setSelectedDebtId(null);
                    setShowDebtPicker(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>None</Text>
                </TouchableOpacity>
                {debts?.map((debt) => (
                  <TouchableOpacity
                    key={debt.id}
                    style={styles.pickerItem}
                    onPress={() => {
                      setSelectedDebtId(debt.id);
                      setShowDebtPicker(false);
                    }}
                  >
                    <Text style={styles.pickerItemText}>{debt.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.submitButton,
              createTransactionMutation.isPending &&
                styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={createTransactionMutation.isPending}
          >
            <Text style={styles.submitButtonText}>
              {createTransactionMutation.isPending
                ? 'Adding...'
                : 'Add Transaction'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputWithIcon: {
    flex: 1,
    padding: 16,
    paddingLeft: 0,
    fontSize: 16,
    color: '#111827',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#111827',
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 200,
  },
  pickerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#111827',
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#1e40af',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
