export interface Asset {
  id: string; // UUID
  symbol: string; // "BTC", "ETH"
  name: string; // "Bitcoin"
  category: string; // "crypto", "stock"
  exchange?: string; // "Binance", "Tokocrypto"
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
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

export interface Strategy {
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
    totalAllocation?: number;
    entryPlan?: string;

    // Custom fields
    [key: string]: any;
  };
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalEntry {
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
