import { Platform } from 'react-native';

let db: any | null = null;

export const initializeDatabase = async (): Promise<any> => {
  if (db) return db;
  
  if (Platform.OS === 'web') {
    // Mock database for web platform
    db = { 
      mock: true,
      execAsync: async (sql: string) => console.log('Mock execAsync:', sql),
      runAsync: async (sql: string, params?: any[]) => console.log('Mock runAsync:', sql, params),
      getAllAsync: async (sql: string, params?: any[]) => {
        console.log('Mock getAllAsync:', sql, params);
        return [];
      },
      getFirstAsync: async (sql: string, params?: any[]) => {
        console.log('Mock getFirstAsync:', sql, params);
        return null;
      },
      closeAsync: async () => console.log('Mock closeAsync'),
    };
  } else {
    // Only import expo-sqlite on native platforms
    const SQLite = await import('expo-sqlite');
    db = await SQLite.openDatabaseAsync('finance.db');
    
    // Enable foreign key support
    await db.execAsync('PRAGMA foreign_keys = ON;');
  }
  
  return db;
};

export const getDatabase = (): any => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return db;
};

export const closeDatabase = async (): Promise<void> => {
  if (db) {
    if (Platform.OS !== 'web') {
      await db.closeAsync();
    }
    db = null;
  }
};