import { db } from "./db";
import { Asset, JournalEntry, Strategy, Transaction } from "./db/schema";

export interface BackupData {
  version: number;
  timestamp: string;
  data: {
    assets: Asset[];
    transactions: Transaction[];
    strategies: Strategy[];
    journalEntries: JournalEntry[];
  };
}

export const exportData = async (): Promise<Blob> => {
  const assets = await db.assets.toArray();
  const transactions = await db.transactions.toArray();
  const strategies = await db.strategies.toArray();
  const journalEntries = await db.journalEntries.toArray();

  const backup: BackupData = {
    version: 1,
    timestamp: new Date().toISOString(),
    data: {
      assets,
      transactions,
      strategies,
      journalEntries,
    },
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  return blob;
};

export const importData = async (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const backup: BackupData = JSON.parse(content);

        // Verification basic structure
        if (!backup.data || !backup.version) {
          throw new Error("Invalid backup file format");
        }

        await db.transaction(
          "rw",
          db.assets,
          db.transactions,
          db.strategies,
          db.journalEntries,
          async () => {
            // We use bulkPut to merge/overwrite existing records
            if (backup.data.assets?.length)
              await db.assets.bulkPut(backup.data.assets);
            if (backup.data.transactions?.length)
              await db.transactions.bulkPut(backup.data.transactions);
            if (backup.data.strategies?.length)
              await db.strategies.bulkPut(backup.data.strategies);
            if (backup.data.journalEntries?.length)
              await db.journalEntries.bulkPut(backup.data.journalEntries);
          }
        );
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

export const clearData = async (): Promise<void> => {
  await db.transaction(
    "rw",
    db.assets,
    db.transactions,
    db.strategies,
    db.journalEntries,
    async () => {
      await db.assets.clear();
      await db.transactions.clear();
      await db.strategies.clear();
      await db.journalEntries.clear();
    }
  );
};

export const getStorageUsage = async (): Promise<{
  usage: number;
  quota: number;
}> => {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
    };
  }
  return { usage: 0, quota: 0 };
};
