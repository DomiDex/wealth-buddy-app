import { z } from 'zod';

// Asset Types
export const AssetTypeSchema = z.enum([
  'cash',
  'bank_account',
  'investment',
  'crypto',
  'real_estate',
  'vehicle',
  'other'
]);

export const AssetSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1),
  type: AssetTypeSchema,
  currentValue: z.number().default(0),
  isDeleted: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Transaction Types
export const TransactionTypeSchema = z.enum([
  'income',
  'expense',
  'transfer'
]);

export const TransactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.string(),
  description: z.string().min(1),
  amount: z.number(),
  type: TransactionTypeSchema,
  assetId: z.string().nullable(),
  debtId: z.string().nullable(),
  isDeleted: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Debt Types
export const DebtTypeSchema = z.enum([
  'car_loan',
  'personal_loan',
  'home_loan',
  'other',
]);

export const DebtSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1),
  type: DebtTypeSchema,
  currentBalance: z.number().default(0),
  interestRate: z.number().optional(),
  isDeleted: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Profile Types
export const ProfileSchema = z.object({
  id: z.string(),
  username: z.string().optional(),
  fullName: z.string().optional(),
  updatedAt: z.string(),
});

// Type exports
export type Asset = z.infer<typeof AssetSchema>;
export type AssetType = z.infer<typeof AssetTypeSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type TransactionType = z.infer<typeof TransactionTypeSchema>;
export type Debt = z.infer<typeof DebtSchema>;
export type DebtType = z.infer<typeof DebtTypeSchema>;
export type Profile = z.infer<typeof ProfileSchema>;

// Dashboard Data Types
export interface DashboardData {
  netWorth: number;
  netWorthChange: number;
  netWorthChangePercent: number;
  totalAssets: number;
  totalDebts: number;
  assetBreakdown: AssetBreakdownItem[];
  recentTransactions: Transaction[];
}

export interface AssetBreakdownItem {
  type: AssetType;
  value: number;
  percentage: number;
  count: number;
}

// Form Types
export type CreateAssetInput = Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'isDeleted'>;
export type CreateTransactionInput = Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'isDeleted'>;
export type CreateDebtInput = Omit<Debt, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'isDeleted'>;