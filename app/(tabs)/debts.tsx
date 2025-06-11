import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { useDebts } from '@/features/debts/hooks/useDebts';
import { DebtCard } from '@/features/debts/components/DebtCard';
import { AddDebtModal } from '@/features/debts/components/AddDebtModal';

export default function DebtsScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { data: debts, isLoading } = useDebts();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Debts</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {debts?.map((debt) => (
          <DebtCard key={debt.id} debt={debt} />
        ))}
        
        {!isLoading && (!debts || debts.length === 0) && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No debts yet</Text>
            <Text style={styles.emptySubtitle}>
              Add a loan or liability to get started
            </Text>
          </View>
        )}
      </ScrollView>

      <AddDebtModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </SafeAreaView>
  );
}

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
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#1e40af',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});