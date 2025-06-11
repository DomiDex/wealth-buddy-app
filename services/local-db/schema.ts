import { Platform } from 'react-native';

const MIGRATIONS = [
  // Version 1: Initial schema
  `
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY NOT NULL,
      username TEXT,
      full_name TEXT,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      current_value REAL NOT NULL DEFAULT 0,
      is_deleted INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS debts (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      current_balance REAL NOT NULL DEFAULT 0,
      interest_rate REAL,
      is_deleted INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      asset_id TEXT,
      debt_id TEXT,
      is_deleted INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (asset_id) REFERENCES assets (id),
      FOREIGN KEY (debt_id) REFERENCES debts (id)
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_name TEXT NOT NULL,
      record_id TEXT NOT NULL,
      operation TEXT NOT NULL,
      data TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      synced INTEGER NOT NULL DEFAULT 0
    );
  `,
  // Indexes for better performance
  `CREATE INDEX IF NOT EXISTS idx_assets_user_id ON assets (user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_debts_user_id ON debts (user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions (user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions (date);`,
  `CREATE INDEX IF NOT EXISTS idx_sync_queue_synced ON sync_queue (synced);`,
];

export const runMigrations = async (db: any): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      console.log('Skipping migrations on web platform (using mock database)');
      return;
    }

    console.log('Running database migrations...');

    // For native platforms, run actual migrations
    const SQLite = await import('expo-sqlite');

    await db.withTransactionAsync(async () => {
      // Create version table if it doesn't exist
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS schema_version (
          version INTEGER PRIMARY KEY
        );
      `);

      // Get current version
      const result = await db.getFirstAsync<{ version: number }>(`
        SELECT version FROM schema_version ORDER BY version DESC LIMIT 1;
      `);

      const currentVersion = result?.version || 0;
      const targetVersion = MIGRATIONS.length;

      if (currentVersion < targetVersion) {
        // Run pending migrations
        for (let i = currentVersion; i < targetVersion; i++) {
          console.log(`Running migration ${i + 1}/${targetVersion}`);
          await db.execAsync(MIGRATIONS[i]);
        }

        // Update version
        await db.runAsync(
          `
          INSERT OR REPLACE INTO schema_version (version) VALUES (?);
        `,
          [targetVersion],
        );

        console.log(`Database migrated to version ${targetVersion}`);
      } else {
        console.log('Database is up to date');
      }
    });
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};
