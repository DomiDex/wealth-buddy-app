import { Platform } from 'react-native';
import {
  Asset,
  Transaction,
  Debt,
  CreateAssetInput,
  CreateTransactionInput,
  CreateDebtInput,
} from '@/types';

const DEMO_USER_ID = 'demo-user';

// Mock data for web platform
const mockAssets: Asset[] = [
  {
    id: 'asset_1',
    userId: DEMO_USER_ID,
    name: 'Savings Account',
    type: 'bank_account',
    currentValue: 15000,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'asset_2',
    userId: DEMO_USER_ID,
    name: 'Investment Portfolio',
    type: 'investment',
    currentValue: 25000,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockTransactions: Transaction[] = [
  {
    id: 'transaction_1',
    userId: DEMO_USER_ID,
    date: new Date().toISOString(),
    description: 'Salary',
    amount: 5000,
    type: 'income',
    assetId: 'asset_1',
    debtId: null,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'transaction_2',
    userId: DEMO_USER_ID,
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    description: 'Groceries',
    amount: 150,
    type: 'expense',
    assetId: 'asset_1',
    debtId: null,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockDebts: Debt[] = [
  {
    id: 'debt_1',
    userId: DEMO_USER_ID,
    name: 'Car Loan',
    type: 'car_loan',
    currentBalance: 12500,
    interestRate: 4.5,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'debt_2',
    userId: DEMO_USER_ID,
    name: 'Student Loan',
    type: 'personal_loan',
    currentBalance: 30000,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Asset Queries
export const getAssets = async (db: any): Promise<Asset[]> => {
  if (Platform.OS === 'web' || db.mock) {
    return mockAssets.filter((asset) => !asset.isDeleted);
  }

  const assets = await db.getAllAsync<any>(
    `
    SELECT * FROM assets 
    WHERE user_id = ? AND is_deleted = 0 
    ORDER BY created_at DESC
  `,
    [DEMO_USER_ID],
  );

  return assets.map((asset) => ({
    id: asset.id,
    userId: asset.user_id,
    name: asset.name,
    type: asset.type,
    currentValue: asset.current_value,
    isDeleted: Boolean(asset.is_deleted),
    createdAt: asset.created_at,
    updatedAt: asset.updated_at,
  }));
};

export const createAsset = async (
  db: any,
  input: CreateAssetInput,
): Promise<string> => {
  const id = `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();

  if (Platform.OS === 'web' || db.mock) {
    const newAsset: Asset = {
      id,
      userId: DEMO_USER_ID,
      name: input.name,
      type: input.type,
      currentValue: input.currentValue,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };
    mockAssets.push(newAsset);
    return id;
  }

  await db.runAsync(
    `
    INSERT INTO assets (id, user_id, name, type, current_value, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
    [id, DEMO_USER_ID, input.name, input.type, input.currentValue, now, now],
  );

  return id;
};

export const updateAsset = async (
  db: any,
  id: string,
  updates: Partial<CreateAssetInput>,
): Promise<void> => {
  const now = new Date().toISOString();

  if (Platform.OS === 'web' || db.mock) {
    const assetIndex = mockAssets.findIndex((asset) => asset.id === id);
    if (assetIndex !== -1) {
      mockAssets[assetIndex] = {
        ...mockAssets[assetIndex],
        ...updates,
        updatedAt: now,
      };
    }
    return;
  }

  const fields = [];
  const values = [];

  if (updates.name !== undefined) {
    fields.push('name = ?');
    values.push(updates.name);
  }
  if (updates.type !== undefined) {
    fields.push('type = ?');
    values.push(updates.type);
  }
  if (updates.currentValue !== undefined) {
    fields.push('current_value = ?');
    values.push(updates.currentValue);
  }

  if (fields.length > 0) {
    fields.push('updated_at = ?');
    values.push(now);
    values.push(id);
    values.push(DEMO_USER_ID);

    await db.runAsync(
      `
      UPDATE assets SET ${fields.join(', ')} 
      WHERE id = ? AND user_id = ?
    `,
      values,
    );
  }
};

export const deleteAsset = async (db: any, id: string): Promise<void> => {
  const now = new Date().toISOString();

  if (Platform.OS === 'web' || db.mock) {
    const assetIndex = mockAssets.findIndex((asset) => asset.id === id);
    if (assetIndex !== -1) {
      mockAssets[assetIndex].isDeleted = true;
      mockAssets[assetIndex].updatedAt = now;
    }
    return;
  }

  await db.runAsync(
    `
    UPDATE assets SET is_deleted = 1, updated_at = ? 
    WHERE id = ? AND user_id = ?
  `,
    [now, id, DEMO_USER_ID],
  );
};

// Transaction Queries
export const getTransactions = async (
  db: any,
  limit = 50,
): Promise<Transaction[]> => {
  if (Platform.OS === 'web' || db.mock) {
    return mockTransactions
      .filter((transaction) => !transaction.isDeleted)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  const transactions = await db.getAllAsync<any>(
    `
    SELECT t.*, a.name as asset_name, d.name as debt_name
    FROM transactions t
    LEFT JOIN assets a ON t.asset_id = a.id
    LEFT JOIN debts d ON t.debt_id = d.id
    WHERE t.user_id = ? AND t.is_deleted = 0 
    ORDER BY t.date DESC, t.created_at DESC
    LIMIT ?
  `,
    [DEMO_USER_ID, limit],
  );

  return transactions.map((transaction) => ({
    id: transaction.id,
    userId: transaction.user_id,
    date: transaction.date,
    description: transaction.description,
    amount: transaction.amount,
    type: transaction.type,
    assetId: transaction.asset_id,
    debtId: transaction.debt_id,
    isDeleted: Boolean(transaction.is_deleted),
    createdAt: transaction.created_at,
    updatedAt: transaction.updated_at,
  }));
};

export const createTransaction = async (
  db: any,
  input: CreateTransactionInput,
): Promise<string> => {
  const id = `transaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();

  if (Platform.OS === 'web' || db.mock) {
    const newTransaction: Transaction = {
      id,
      userId: DEMO_USER_ID,
      date: input.date,
      description: input.description,
      amount: input.amount,
      type: input.type,
      assetId: input.assetId,
      debtId: input.debtId,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };
    mockTransactions.push(newTransaction);

    // Update debt balance if transaction is linked to a debt
    if (input.debtId) {
      const debtIndex = mockDebts.findIndex((d) => d.id === input.debtId);
      if (debtIndex !== -1) {
        const amountChange =
          input.type === 'income' ? input.amount : -input.amount;
        mockDebts[debtIndex].currentBalance += amountChange;
        mockDebts[debtIndex].updatedAt = now;
      }
    }
    return id;
  }

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `
      INSERT INTO transactions (id, user_id, date, description, amount, type, asset_id, debt_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        id,
        DEMO_USER_ID,
        input.date,
        input.description,
        input.amount,
        input.type,
        input.assetId,
        input.debtId,
        now,
        now,
      ],
    );

    // Update debt balance if transaction is linked to a debt
    if (input.debtId) {
      const amountChange =
        input.type === 'income' ? input.amount : -input.amount;
      await db.runAsync(
        `
        UPDATE debts
        SET current_balance = current_balance + ?, updated_at = ?
        WHERE id = ? AND user_id = ?
      `,
        [amountChange, now, input.debtId, DEMO_USER_ID],
      );
    }
  });

  return id;
};

export const updateTransaction = async (
  db: any,
  id: string,
  updates: Partial<CreateTransactionInput>,
): Promise<void> => {
  // Note: This is a simplified update. A full implementation would need to revert old balance changes and apply new ones.
  const now = new Date().toISOString();
  // ... implementation for mock and real db ...
};

export const deleteTransaction = async (db: any, id: string): Promise<void> => {
  // Note: This is a simplified delete. A full implementation would need to revert balance changes.
  const now = new Date().toISOString();
  // ... implementation for mock and real db ...
};

// Debt Queries
export const getDebts = async (db: any): Promise<Debt[]> => {
  if (Platform.OS === 'web' || db.mock) {
    return mockDebts.filter((debt) => !debt.isDeleted);
  }

  const debts = await db.getAllAsync<any>(
    `
    SELECT * FROM debts 
    WHERE user_id = ? AND is_deleted = 0 
    ORDER BY created_at DESC
  `,
    [DEMO_USER_ID],
  );

  return debts.map((debt) => ({
    id: debt.id,
    userId: debt.user_id,
    name: debt.name,
    type: debt.type,
    currentBalance: debt.current_balance,
    interestRate: debt.interest_rate,
    isDeleted: Boolean(debt.is_deleted),
    createdAt: debt.created_at,
    updatedAt: debt.updated_at,
  }));
};

export const createDebt = async (
  db: any,
  input: CreateDebtInput,
): Promise<string> => {
  const id = `debt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();

  if (Platform.OS === 'web' || db.mock) {
    const newDebt: Debt = {
      id,
      userId: DEMO_USER_ID,
      ...input,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };
    mockDebts.push(newDebt);
    return id;
  }

  await db.runAsync(
    `
    INSERT INTO debts (id, user_id, name, type, current_balance, interest_rate, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      id,
      DEMO_USER_ID,
      input.name,
      input.type,
      input.currentBalance,
      input.interestRate,
      now,
      now,
    ],
  );

  return id;
};

export const updateDebt = async (
  db: any,
  id: string,
  updates: Partial<CreateDebtInput>,
): Promise<void> => {
  const now = new Date().toISOString();

  if (Platform.OS === 'web' || db.mock) {
    const debtIndex = mockDebts.findIndex((d) => d.id === id);
    if (debtIndex !== -1) {
      mockDebts[debtIndex] = {
        ...mockDebts[debtIndex],
        ...updates,
        updatedAt: now,
      };
    }
    return;
  }

  const fields = [];
  const values = [];

  if (updates.name !== undefined) {
    fields.push('name = ?');
    values.push(updates.name);
  }
  if (updates.type !== undefined) {
    fields.push('type = ?');
    values.push(updates.type);
  }
  if (updates.currentBalance !== undefined) {
    fields.push('current_balance = ?');
    values.push(updates.currentBalance);
  }
  if (updates.interestRate !== undefined) {
    fields.push('interest_rate = ?');
    values.push(updates.interestRate);
  }

  if (fields.length > 0) {
    fields.push('updated_at = ?');
    values.push(now);
    values.push(id);
    values.push(DEMO_USER_ID);

    await db.runAsync(
      `
      UPDATE debts SET ${fields.join(', ')} 
      WHERE id = ? AND user_id = ?
    `,
      values,
    );
  }
};

export const deleteDebt = async (db: any, id: string): Promise<void> => {
  const now = new Date().toISOString();

  if (Platform.OS === 'web' || db.mock) {
    const debtIndex = mockDebts.findIndex((d) => d.id === id);
    if (debtIndex !== -1) {
      mockDebts[debtIndex].isDeleted = true;
      mockDebts[debtIndex].updatedAt = now;
    }
    return;
  }

  await db.runAsync(
    `
    UPDATE debts SET is_deleted = 1, updated_at = ? 
    WHERE id = ? AND user_id = ?
  `,
    [now, id, DEMO_USER_ID],
  );
};

// Dashboard Queries
export const getDashboardData = async (db: any) => {
  if (Platform.OS === 'web' || db.mock) {
    const totalAssets = mockAssets
      .filter((asset) => !asset.isDeleted)
      .reduce((sum, asset) => sum + asset.currentValue, 0);

    const totalDebts = mockDebts
      .filter((debt) => !debt.isDeleted)
      .reduce((sum, debt) => sum + debt.currentBalance, 0);

    const netWorth = totalAssets - totalDebts;

    const assetBreakdown = mockAssets
      .filter((asset) => !asset.isDeleted)
      .reduce((acc, asset) => {
        const existing = acc.find((item) => item.type === asset.type);
        if (existing) {
          existing.value += asset.currentValue;
          existing.count += 1;
        } else {
          acc.push({
            type: asset.type,
            value: asset.currentValue,
            count: 1,
            percentage: 0,
          });
        }
        return acc;
      }, [] as any[]);

    // Calculate percentages
    assetBreakdown.forEach((item) => {
      item.percentage = totalAssets > 0 ? (item.value / totalAssets) * 100 : 0;
    });

    return {
      totalAssets,
      totalDebts,
      netWorth,
      netWorthChange: 0,
      netWorthChangePercent: 0,
      assetBreakdown,
    };
  }

  // Get total assets
  const assetResult = await db.getFirstAsync<{ total: number }>(
    `
    SELECT COALESCE(SUM(current_value), 0) as total 
    FROM assets 
    WHERE user_id = ? AND is_deleted = 0
  `,
    [DEMO_USER_ID],
  );

  // Get total debts
  const debtResult = await db.getFirstAsync<{ total: number }>(
    `
    SELECT COALESCE(SUM(current_balance), 0) as total 
    FROM debts 
    WHERE user_id = ? AND is_deleted = 0
  `,
    [DEMO_USER_ID],
  );

  // Get asset breakdown
  const assetBreakdown = await db.getAllAsync<any>(
    `
    SELECT 
      type,
      COUNT(*) as count,
      SUM(current_value) as value
    FROM assets 
    WHERE user_id = ? AND is_deleted = 0
    GROUP BY type
    ORDER BY value DESC
  `,
    [DEMO_USER_ID],
  );

  const totalAssets = assetResult?.total || 0;
  const totalDebts = debtResult?.total || 0;
  const netWorth = totalAssets - totalDebts;

  return {
    totalAssets,
    totalDebts,
    netWorth,
    netWorthChange: 0, // TODO: Calculate based on historical data
    netWorthChangePercent: 0, // TODO: Calculate based on historical data
    assetBreakdown: assetBreakdown.map((item) => ({
      type: item.type,
      value: item.value,
      count: item.count,
      percentage: totalAssets > 0 ? (item.value / totalAssets) * 100 : 0,
    })),
  };
};
