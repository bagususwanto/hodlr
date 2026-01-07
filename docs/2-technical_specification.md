# Hodlr - Technical Specification

## Overview

Aplikasi PWA untuk manajemen portfolio investasi dengan penyimpanan data lokal (IndexedDB).

---

## Tech Stack

| Layer     | Technology                 |
| --------- | -------------------------- |
| Framework | Next.js 15 (Static Export) |
| Language  | TypeScript                 |
| PWA       | next-pwa                   |
| State     | Zustand                    |
| Storage   | Dexie.js (IndexedDB)       |
| UI        | Tailwind CSS + shadcn/ui   |
| Charts    | Recharts                   |
| Icons     | Lucide React               |
| Forms     | React Hook Form + Zod      |
| Date      | date-fns                   |
| Utilities | uuid, clsx                 |
| Export    | jsPDF (PDF), xlsx (Excel)  |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx           # Dashboard
│   ├── strategies/        # Strategi Investasi
│   ├── journal/           # Jurnal Trading
│   ├── assets/            # Tracker Aset
│   ├── analytics/         # Analisis & Statistik
│   └── settings/          # Pengaturan
├── components/
│   ├── ui/                # shadcn components
│   ├── dashboard/
│   ├── strategies/
│   ├── journal/
│   ├── assets/
│   └── analytics/
├── lib/
│   ├── db/                # Dexie database
│   │   ├── index.ts       # DB instance
│   │   ├── schema.ts      # Table schemas
│   │   └── hooks.ts       # React hooks for DB
│   ├── utils.ts
│   └── calculations.ts    # P&L, avg cost, etc.
├── stores/                # Zustand stores
│   └── app-store.ts
└── types/
    └── index.ts           # TypeScript interfaces
```

---

## Database Schema (IndexedDB via Dexie)

### Assets Table

```typescript
interface Asset {
  id: string; // UUID
  symbol: string; // "BTC", "ETH"
  name: string; // "Bitcoin"
  category: string; // "crypto", "stock"
  exchange?: string; // "Binance", "Tokocrypto"
  createdAt: Date;
  updatedAt: Date;
}
```

### Transactions Table

```typescript
interface Transaction {
  id: string; // UUID
  assetId: string; // FK to Asset
  type: "BUY" | "SELL" | "SWAP";
  quantity: number; // Jumlah aset
  price: number; // Harga per unit
  totalValue: number; // quantity * price
  fee?: number; // Biaya transaksi
  date: Date; // Tanggal transaksi
  notes?: string; // Catatan
  tags?: string[]; // ["dca", "swing"]
  strategyId?: string; // FK to Strategy (optional)
  createdAt: Date;
  updatedAt: Date;
}
```

### Strategies Table

```typescript
interface Strategy {
  id: string;
  name: string;
  type:
    | "DCA"
    | "LUMP_SUM"
    | "VALUE_AVERAGING"
    | "SWING"
    | "HODL"
    | "REBALANCING"
    | "CUSTOM";
  assetId?: string; // FK to Asset (optional)
  config: {
    // DCA specific
    amount?: number; // Jumlah per periode
    frequency?: "daily" | "weekly" | "monthly";

    // Swing specific
    entryZone?: { min: number; max: number };
    takeProfit?: number;
    stopLoss?: number;

    // Custom fields
    [key: string]: any;
  };
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Journal Entries Table

```typescript
interface JournalEntry {
  id: string;
  transactionId?: string; // FK to Transaction (optional)
  strategyId?: string; // FK to Strategy (optional)
  title: string;
  content: string; // Markdown content
  type: "PRE_TRADE" | "POST_TRADE" | "ANALYSIS" | "NOTE";
  tags?: string[];
  attachments?: string[]; // Base64 images
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Dexie Database Setup

```typescript
// lib/db/index.ts
import Dexie, { Table } from "dexie";

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
```

---

## Core Calculations

### Average Cost Calculation

```typescript
function calculateAverageCost(transactions: Transaction[]): number {
  const buyTxs = transactions.filter((t) => t.type === "BUY");
  const totalCost = buyTxs.reduce((sum, t) => sum + t.totalValue, 0);
  const totalQty = buyTxs.reduce((sum, t) => sum + t.quantity, 0);
  return totalQty > 0 ? totalCost / totalQty : 0;
}
```

### Current Holdings

```typescript
function calculateHoldings(transactions: Transaction[]): number {
  return transactions.reduce((total, t) => {
    if (t.type === "BUY") return total + t.quantity;
    if (t.type === "SELL") return total - t.quantity;
    return total;
  }, 0);
}
```

### Realized P&L

```typescript
function calculateRealizedPnL(transactions: Transaction[]): number {
  const sells = transactions.filter((t) => t.type === "SELL");
  const avgCost = calculateAverageCost(transactions);

  return sells.reduce((total, sell) => {
    const cost = sell.quantity * avgCost;
    const revenue = sell.totalValue;
    return total + (revenue - cost);
  }, 0);
}
```

---

## Pages & Routes

| Route              | Page            | Description                 |
| ------------------ | --------------- | --------------------------- |
| `/`                | Dashboard       | Overview portfolio          |
| `/strategies`      | Strategies List | Daftar strategi             |
| `/strategies/new`  | Create Strategy | Buat strategi baru          |
| `/strategies/[id]` | Strategy Detail | Detail & progress           |
| `/journal`         | Journal List    | Daftar jurnal               |
| `/journal/new`     | Create Entry    | Buat jurnal baru            |
| `/assets`          | Asset Tracker   | Daftar holdings             |
| `/assets/[id]`     | Asset Detail    | History transaksi           |
| `/analytics`       | Analytics       | Statistik & chart           |
| `/settings`        | Settings        | Backup/restore, preferences |

---

## PWA Configuration

```javascript
// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  output: "export",
  // ... other config
});
```

---

## Export/Import Data

```typescript
// Export
async function exportData(): Promise<string> {
  const data = {
    assets: await db.assets.toArray(),
    transactions: await db.transactions.toArray(),
    strategies: await db.strategies.toArray(),
    journalEntries: await db.journalEntries.toArray(),
    exportedAt: new Date().toISOString(),
    version: "1.0",
  };
  return JSON.stringify(data, null, 2);
}

// Import
async function importData(jsonString: string): Promise<void> {
  const data = JSON.parse(jsonString);
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

      await db.assets.bulkAdd(data.assets);
      await db.transactions.bulkAdd(data.transactions);
      await db.strategies.bulkAdd(data.strategies);
      await db.journalEntries.bulkAdd(data.journalEntries);
    }
  );
}
```

---

## UI Components (shadcn/ui)

Components yang akan digunakan:

- Button, Input, Select, Textarea
- Card, Dialog, Sheet
- Table, Tabs
- Form (react-hook-form + zod)
- Toast (notifications)
- Calendar, DatePicker

---

_Dokumen ini menjadi acuan teknis untuk development aplikasi Hodlr._
