import { useTransactions } from "./use-transactions";
import {
  calculateHoldings,
  calculateAverageCost,
  calculateTotalInvested,
  calculateRealizedPnL,
} from "@/lib/finance";

export function useAssetStats(assetId: string) {
  const { transactions, isLoading } = useTransactions(assetId);

  if (!transactions || transactions.length === 0) {
    return {
      holdings: 0,
      avgCost: 0,
      totalInvested: 0,
      realizedPnL: 0,
      realizedPnLPercent: 0,
      isLoading,
    };
  }

  const holdings = calculateHoldings(transactions);
  const avgCost = calculateAverageCost(transactions);
  const totalInvested = calculateTotalInvested(transactions);
  const { realizedPnL, realizedPnLPercent } =
    calculateRealizedPnL(transactions);

  return {
    holdings,
    avgCost,
    totalInvested,
    realizedPnL,
    realizedPnLPercent,
    isLoading,
  };
}
