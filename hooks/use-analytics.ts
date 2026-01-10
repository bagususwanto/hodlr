import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import {
  calculateAverageWinLoss,
  calculateRealizedPnL,
  calculateTotalInvested,
  calculateWinRate,
  generateAssetAllocation,
  generatePortfolioHistory,
} from "@/lib/finance";
import { useMemo, useState } from "react";
import { subDays, isAfter } from "date-fns";

export type Period = "7D" | "30D" | "90D" | "1Y" | "ALL";

export function useAnalytics() {
  const [period, setPeriod] = useState<Period>("ALL");

  const data = useLiveQuery(async () => {
    const [transactions, assets] = await Promise.all([
      db.transactions.toArray(),
      db.assets.toArray(),
    ]);
    return { transactions, assets };
  });

  const metrics = useMemo(() => {
    if (!data) return null;
    const { transactions, assets } = data;

    // Filter transactions based on period
    const now = new Date();
    let cutoffDate: Date | null = null;

    switch (period) {
      case "7D":
        cutoffDate = subDays(now, 7);
        break;
      case "30D":
        cutoffDate = subDays(now, 30);
        break;
      case "90D":
        cutoffDate = subDays(now, 90);
        break;
      case "1Y":
        cutoffDate = subDays(now, 365);
        break;
      case "ALL":
      default:
        cutoffDate = null;
    }

    const filteredTransactions = cutoffDate
      ? transactions.filter((t) => isAfter(new Date(t.date), cutoffDate))
      : transactions;

    // Calculate period metrics
    const { realizedPnL, realizedPnLPercent } =
      calculateRealizedPnL(filteredTransactions);
    const winRate = calculateWinRate(filteredTransactions);
    const { avgWin, avgLoss } = calculateAverageWinLoss(filteredTransactions);

    // Calculate Global Data for Charts (independent of period filter start, but sensitive to 'current' state? No, chart history needs full context)
    // Actually, for history chart we want to slice the view.
    // Logic: Generate FULL history, then filter the Data Points.
    const fullHistory = generatePortfolioHistory(transactions);

    const historyData = cutoffDate
      ? fullHistory.filter((h) => isAfter(new Date(h.date), cutoffDate))
      : fullHistory;

    // Allocation is typically "Current Allocation" regardless of period filter in most apps,
    // unless "Allocation at end of period". We will use Current Allocation (All Transactions).
    const allocationData = generateAssetAllocation(transactions, assets);

    // Total Invested is "Current", so use All Transactions
    const totalInvested = calculateTotalInvested(transactions);

    return {
      totalInvested,
      realizedPnL,
      realizedPnLPercent,
      winRate,
      avgWin,
      avgLoss,
      transactionCount: filteredTransactions.length,
      historyData,
      allocationData,
    };
  }, [data, period]);

  return {
    period,
    setPeriod,
    metrics,
    isLoading: !data,
  };
}
