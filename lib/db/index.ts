import Dexie, { Table } from "dexie";
import { Asset, JournalEntry, Strategy, Transaction } from "./schema";

export class HodlrDB extends Dexie {
  assets!: Table<Asset>;
  transactions!: Table<Transaction>;
  strategies!: Table<Strategy>;
  journalEntries!: Table<JournalEntry>;

  constructor() {
    super("hodlr-db");
    this.version(1).stores({
      assets: "id, symbol, category, exchange",
      transactions: "id, assetId, type, date, strategyId",
      strategies: "id, type, status, assetId",
      journalEntries: "id, transactionId, strategyId, type, date",
    });
  }
}

export const db = new HodlrDB();
