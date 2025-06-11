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
import { X, DollarSign, Percent } from 'lucide-react-native';
import { useCreateDebt } from '@/features/debts/hooks/useDebts';
import { DebtType } from '@/types';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const DEBT_TYPES: { value: DebtType; label: string }[] = [
  { value: 'home_loan', label: 'Home Loan' },
  { value: 'car_loan', label: 'Car Loan' },
  { value: 'personal_loan', label: 'Personal Loan' },
  { value: 'other', label: 'Other' },
];

export const AddDebtModal: React.FC<Props> = ({ visible, onClose }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<DebtType>('other');
  const [currentBalance, setCurrentBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createDebtMutation = useCreateDebt();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Debt name is required';
    if (!currentBalance.trim())
      newErrors.currentBalance = 'Current balance is required';
    else if (isNaN(Number(currentBalance)))
      newErrors.currentBalance = 'Please enter a valid number';
    if (interestRate.trim() && isNaN(Number(interestRate)))
      newErrors.interestRate = 'Please enter a valid number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createDebtMutation.mutateAsync({
        name: name.trim(),
        type,
        currentBalance: Number(currentBalance),
        interestRate: interestRate ? Number(interestRate) : undefined,
      });
      handleClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create debt. Please try again.');
    }
  };

  const handleClose = () => {
    setName('');
    setType('other');
    setCurrentBalance('');
    setInterestRate('');
    setErrors({});
    onClose();
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
          <Text style={styles.title}>Add New Debt</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>Debt Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Mortgage, Car Loan"
              placeholderTextColor="#9ca3af"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Debt Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {DEBT_TYPES.map((debtType) => (
                <TouchableOpacity
                  key={debtType.value}
                  style={[
                    styles.typeButton,
                    type === debtType.value && styles.typeButtonActive,
                  ]}
                  onPress={() => setType(debtType.value)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === debtType.value && styles.typeButtonTextActive,
                    ]}
                  >
                    {debtType.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Current Balance</Text>
            <View
              style={[
                styles.inputContainer,
                errors.currentBalance && styles.inputError,
              ]}
            >
              <DollarSign size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.inputWithIcon}
                value={currentBalance}
                onChangeText={setCurrentBalance}
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
            </View>
            {errors.currentBalance && (
              <Text style={styles.errorText}>{errors.currentBalance}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Interest Rate (Optional)</Text>
            <View
              style={[
                styles.inputContainer,
                errors.interestRate && styles.inputError,
              ]}
            >
              <Percent size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.inputWithIcon}
                value={interestRate}
                onChangeText={setInterestRate}
                placeholder="e.g., 4.5"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
            </View>
            {errors.interestRate && (
              <Text style={styles.errorText}>{errors.interestRate}</Text>
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
              createDebtMutation.isPending && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={createDebtMutation.isPending}
          >
            <Text style={styles.submitButtonText}>
              {createDebtMutation.isPending ? 'Adding...' : 'Add Debt'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
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
  title: { fontSize: 20, fontWeight: '600', color: '#111827' },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { flex: 1, padding: 20 },
  section: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  inputError: { borderColor: '#dc2626' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 12 },
  inputWithIcon: {
    flex: 1,
    padding: 16,
    paddingLeft: 0,
    fontSize: 16,
    color: '#111827',
  },
  typeButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  typeButtonActive: { backgroundColor: '#1e40af', borderColor: '#1e40af' },
  typeButtonText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  typeButtonTextActive: { color: '#ffffff' },
  errorText: { fontSize: 14, color: '#dc2626', marginTop: 4 },
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
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#6b7280' },
  submitButton: {
    flex: 1,
    backgroundColor: '#1e40af',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
});
