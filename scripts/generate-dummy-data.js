const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const ASSET_COUNT = 50;
const TRANSACTION_COUNT = 1000; // Increased to 1000 to really test pagination
const STRATEGY_COUNT = 50;
const JOURNAL_COUNT = 200;

const CATEGORIES = ["crypto", "stock", "forex", "commodity"];
const EXCHANGES = ["Binance", "Tokocrypto", "Indodax", "GoTrade", "Ajaib"];
const STRATEGY_TYPES = ["DCA", "SWING", "VALUE", "GROWTH", "DIVIDEND"];

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const assets = [];
const strategies = [];
const transactions = [];
const journalEntries = [];

// 1. Generate Assets
const symbols = [
  "BTC",
  "ETH",
  "SOL",
  "ADA",
  "XRP",
  "DOT",
  "AAPL",
  "TSLA",
  "MSFT",
  "GOOG",
  "BBCA",
  "TLKM",
];
for (let i = 0; i < ASSET_COUNT; i++) {
  const baseSymbol = symbols[i % symbols.length];
  const suffix =
    i >= symbols.length ? `-${Math.floor(i / symbols.length)}` : "";

  assets.push({
    id: uuidv4(),
    symbol: `${baseSymbol}${suffix}`,
    name: `${baseSymbol} Token/Stock ${suffix}`,
    category: randomItem(CATEGORIES),
    exchange: randomItem(EXCHANGES),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

// 2. Generate Strategies
for (let i = 0; i < STRATEGY_COUNT; i++) {
  strategies.push({
    id: uuidv4(),
    name: `${randomItem(STRATEGY_TYPES)} Strategy ${i + 1}`,
    type: randomItem(STRATEGY_TYPES),
    assetId: Math.random() > 0.3 ? randomItem(assets).id : undefined,
    status: Math.random() > 0.2 ? "ACTIVE" : "PAUSED",
    config: {
      amount: Math.floor(Math.random() * 1000000),
      frequency: "monthly",
    },
    startDate: randomDate(new Date(2023, 0, 1), new Date()),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

// 3. Generate Transactions
for (let i = 0; i < TRANSACTION_COUNT; i++) {
  const asset = randomItem(assets);
  const type = Math.random() > 0.4 ? "BUY" : "SELL";
  const price = Math.random() * 100000 + 1000;
  const quantity = Math.random() * 10 + 0.1;

  transactions.push({
    id: uuidv4(),
    assetId: asset.id,
    type: type,
    quantity: parseFloat(quantity.toFixed(4)),
    price: parseFloat(price.toFixed(2)),
    totalValue: parseFloat((quantity * price).toFixed(2)),
    fee: parseFloat((quantity * price * 0.001).toFixed(2)),
    date: randomDate(new Date(2023, 0, 1), new Date()),
    strategyId: Math.random() > 0.5 ? randomItem(strategies).id : undefined,
    tags: Math.random() > 0.5 ? ["dummy", "test"] : [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

// 4. Generate Journal Entries
for (let i = 0; i < JOURNAL_COUNT; i++) {
  journalEntries.push({
    id: uuidv4(),
    title: `Journal Entry ${i + 1} - Market Analysis`,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    type: randomItem(["PRE_TRADE", "POST_TRADE", "ANALYSIS", "NOTE"]),
    date: randomDate(new Date(2023, 0, 1), new Date()),
    tags: ["market", "dummy"],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

const backupData = {
  version: 1,
  timestamp: new Date().toISOString(),
  data: {
    assets,
    strategies,
    transactions,
    journalEntries,
  },
};

fs.writeFileSync("dummy-data.json", JSON.stringify(backupData, null, 2));
console.log("Dummy data generated at dummy-data.json");
