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
import { X, DollarSign } from 'lucide-react-native';
import { useCreateAsset } from '@/features/assets/hooks/useAssets';
import { AssetType } from '@/types';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const ASSET_TYPES: { value: AssetType; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_account', label: 'Bank Account' },
  { value: 'investment', label: 'Investment' },
  { value: 'crypto', label: 'Cryptocurrency' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'other', label: 'Other' },
];

export const AddAssetModal: React.FC<Props> = ({ visible, onClose }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<AssetType>('cash');
  const [currentValue, setCurrentValue] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createAssetMutation = useCreateAsset();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Asset name is required';
    }

    if (!currentValue.trim()) {
      newErrors.currentValue = 'Current value is required';
    } else if (isNaN(Number(currentValue))) {
      newErrors.currentValue = 'Please enter a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createAssetMutation.mutateAsync({
        name: name.trim(),
        type,
        currentValue: Number(currentValue),
      });

      // Reset form
      setName('');
      setType('cash');
      setCurrentValue('');
      setErrors({});
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create asset. Please try again.');
    }
  };

  const handleClose = () => {
    setName('');
    setType('cash');
    setCurrentValue('');
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
          <Text style={styles.title}>Add New Asset</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>Asset Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Savings Account, Bitcoin Wallet"
              placeholderTextColor="#9ca3af"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Asset Type</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.typeContainer}
            >
              {ASSET_TYPES.map((assetType) => (
                <TouchableOpacity
                  key={assetType.value}
                  style={[
                    styles.typeButton,
                    type === assetType.value && styles.typeButtonActive,
                  ]}
                  onPress={() => setType(assetType.value)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === assetType.value && styles.typeButtonTextActive,
                    ]}
                  >
                    {assetType.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Current Value</Text>
            <View
              style={[
                styles.inputContainer,
                errors.currentValue && styles.inputError,
              ]}
            >
              <DollarSign size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.inputWithIcon}
                value={currentValue}
                onChangeText={setCurrentValue}
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
            </View>
            {errors.currentValue && (
              <Text style={styles.errorText}>{errors.currentValue}</Text>
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
              createAssetMutation.isPending && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={createAssetMutation.isPending}
          >
            <Text style={styles.submitButtonText}>
              {createAssetMutation.isPending ? 'Adding...' : 'Add Asset'}
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
  typeButtonActive: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#ffffff',
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
