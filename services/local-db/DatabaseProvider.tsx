import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { initializeDatabase } from './index';
import { runMigrations } from './schema';

interface DatabaseContextType {
  db: any | null;
  isReady: boolean;
  error: string | null;
}

const DatabaseContext = createContext<DatabaseContextType>({
  db: null,
  isReady: false,
  error: null,
});

export const useDatabaseContext = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabaseContext must be used within DatabaseProvider');
  }
  return context;
};

interface Props {
  children: React.ReactNode;
}

export const DatabaseProvider: React.FC<Props> = ({ children }) => {
  const [db, setDb] = useState<any | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        if (Platform.OS === 'web') {
          // For web platform, we'll use a mock database or localStorage
          console.log('Web platform detected - using mock database');
          setDb({ mock: true });
          setIsReady(true);
          console.log('Mock database ready');
        } else {
          console.log('Initializing native database...');
          const database = await initializeDatabase();
          await runMigrations(database);
          setDb(database);
          setIsReady(true);
          console.log('Database ready');
        }
      } catch (err) {
        console.error('Database setup failed:', err);
        setError(err instanceof Error ? err.message : 'Database setup failed');
      }
    };

    setupDatabase();
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, isReady, error }}>
      {children}
    </DatabaseContext.Provider>
  );
};