import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { useAsset } from "./use-assets";

export interface StrategyStats {
  totalInvested: number;
  totalQuantity: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercentage: number;
  transactionCount: number;
}

export function useStrategyStats(strategyId: string) {
  // 1. Get strategy to know the asset
  const strategy = useLiveQuery(
    () => db.strategies.get(strategyId),
    [strategyId]
  );

  // 2. Get all transactions linked to this strategy
  const transactions = useLiveQuery(
    () => db.transactions.where("strategyId").equals(strategyId).toArray(),
    [strategyId]
  );

  // 3. Get asset latest price (mock version for now, later from real API or stored price)
  // For now we might not have 'currentPrice' in Asset schema explicitly updated,
  // but let's assume we can get it or fallback to last transaction price.
  // In a real app, this hook would consume a price feed.
  // We'll trust useAsset to give us the asset metadata.
  const { asset } = useAsset(strategy?.assetId || "");

  // CALCULATIONS
  const stats: StrategyStats = {
    totalInvested: 0,
    totalQuantity: 0,
    currentValue: 0,
    unrealizedPnL: 0,
    unrealizedPnLPercentage: 0,
    transactionCount: 0,
  };

  if (transactions && strategy) {
    stats.transactionCount = transactions.length;

    transactions.forEach((tx) => {
      if (tx.type === "BUY") {
        stats.totalInvested += tx.totalValue; // Cost basis
        stats.totalInvested += tx.fee || 0; // Include fees in cost? Usually yes.
        stats.totalQuantity += tx.quantity;
      } else if (tx.type === "SELL") {
        // Simple logic: reducing quantity.
        // Realized PnL is complex, for now let's just track current holding from this strategy.
        stats.totalQuantity -= tx.quantity;
        // Reducing invested amount proportionally? Or FIFO?
        // For simple "Strategy Tracking", we often care about "Net Invested" or "Remaining Cost Basis".
        // Let's keep it simple: Total Invested is cumulative inflows.
      }
    });

    // Mock Current Price for demo if not available
    // In future, this comes from a PriceContext or similar
    const currentPrice = 100000; // Placeholder: 100k USD/IDR?
    // Ideally we need a way to pass current price to this hook.

    // For now, let's just use 0 if we don't have price, or maybe we can't calculate value yet.
    // stats.currentValue = stats.totalQuantity * currentPrice;

    // stats.unrealizedPnL = stats.currentValue - stats.totalInvested;
  }

  // To make this useful immediately without real-time prices,
  // we will return the "Accumulated" stats (Invested, Quantity).
  // "Value" and "PnL" will be 0 until we have price feeds.

  return { stats, isLoading: !transactions || !strategy };
}
