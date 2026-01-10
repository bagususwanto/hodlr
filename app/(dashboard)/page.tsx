"use client";

import { useAssets } from "@/hooks/use-assets";
import { useTransactions } from "@/hooks/use-transactions";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { PortfolioAllocation } from "@/components/dashboard/portfolio-allocation";
import { PerformanceCards } from "@/components/dashboard/performance-cards";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { useMemo } from "react";

export default function DashboardPage() {
  const { assets } = useAssets();
  const { transactions } = useTransactions();

  // Dashboard Data Calculation
  const dashboardData = useMemo(() => {
    if (!assets || !transactions) {
      return {
        totalValue: 0,
        realizedPnL: 0,
        investedValue: 0,
        allocationData: [],
        bestPerformer: undefined,
        worstPerformer: undefined,
        recentTransactions: [],
      };
    }

    // 1. Calculate Realized P&L and Current Holdings per Asset
    let totalRealizedPnL = 0;
    const assetHoldings = new Map<
      string,
      {
        quantity: number;
        costBasis: number; // Total cost of currently held tokens
        realizedPnL: number;
        lastPrice: number;
      }
    >();

    // Initialize map
    assets.forEach((asset) => {
      assetHoldings.set(asset.id, {
        quantity: 0,
        costBasis: 0,
        realizedPnL: 0,
        lastPrice: 0,
      });
    });

    // Process transactions sorted by date (oldest first for accurate cost basis if we did FIFO, but here we do Avg Cost)
    // The hook returns reverse() (newest first). We should reverse it back for calculation if needed,
    // but for Avg Cost, order matters less for Cost Basis, but matters for Realized P&L.
    // Actually, simple Avg Cost:
    // Buy: Update Avg Cost.
    // Sell: Realized = (Price - AvgCost) * Qty.

    // Create a copy and sort oldest first
    const sortedTx = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    sortedTx.forEach((tx) => {
      const holding = assetHoldings.get(tx.assetId);
      if (!holding) return;

      if (tx.type === "BUY") {
        // Update Cost Basis
        // New Total Cost = Old Total Cost + (Price * Qty)
        // Avg Cost = New Total Cost / New Total Qty
        holding.costBasis += tx.totalValue;
        holding.quantity += tx.quantity;
        holding.lastPrice = tx.price; // Update last known price
      } else if (tx.type === "SELL") {
        // Calculate Avg Cost
        const avgCost =
          holding.quantity > 0 ? holding.costBasis / holding.quantity : 0;

        // Realized PnL for this tx
        const txPnL = (tx.price - avgCost) * tx.quantity;
        holding.realizedPnL += txPnL;
        totalRealizedPnL += txPnL;

        // Reduce Quantity and Cost Basis
        holding.quantity -= tx.quantity;
        holding.costBasis -= avgCost * tx.quantity;
        holding.lastPrice = tx.price;
      }
      // TODO: Handle SWAP logic if needed
    });

    // 2. Calculate Portfolio Totals
    let totalValue = 0;
    let totalInvested = 0;
    const allocationMap = new Map<string, number>(); // Category -> Value
    const performanceList: any[] = [];

    assets.forEach((asset) => {
      const holding = assetHoldings.get(asset.id);
      if (!holding) return;

      const currentValue = holding.quantity * holding.lastPrice;

      // Accumulate totals
      totalValue += currentValue;
      totalInvested += holding.costBasis;

      // Allocation
      const category = asset.category || "Other";
      allocationMap.set(
        category,
        (allocationMap.get(category) || 0) + currentValue
      );

      // Performance (Unrealized P&L %)
      // PnL = Current Value - Cost Basis
      // % = (Current Value - Cost Basis) / Cost Basis
      if (holding.costBasis > 0) {
        const pnl = currentValue - holding.costBasis;
        const pnlPercentage = (pnl / holding.costBasis) * 100;
        performanceList.push({
          name: asset.name,
          symbol: asset.symbol,
          pnl: pnl,
          pnlPercentage: pnlPercentage,
        });
      }
    });

    // 3. Prepare Allocation Data
    const allocationData = Array.from(allocationMap.entries()).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    // 4. Determine Best/Worst Performers
    performanceList.sort((a, b) => b.pnlPercentage - a.pnlPercentage);
    const bestPerformer =
      performanceList.length > 0 ? performanceList[0] : undefined;
    const worstPerformer =
      performanceList.length > 0
        ? performanceList[performanceList.length - 1]
        : undefined;

    // 5. Recent Transactions
    const recentTransactions = transactions.slice(0, 5).map((tx) => {
      const asset = assets.find((a) => a.id === tx.assetId);
      return {
        ...tx,
        assetSymbol: asset ? asset.symbol : "Unknown",
      };
    });

    return {
      totalValue,
      realizedPnL: totalRealizedPnL,
      investedValue: totalInvested,
      allocationData,
      bestPerformer,
      worstPerformer,
      recentTransactions,
    };
  }, [assets, transactions]);

  // Handle loading state
  if (!assets || !transactions) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <DashboardStats
        totalValue={dashboardData.totalValue}
        realizedPnL={dashboardData.realizedPnL}
        investedValue={dashboardData.investedValue}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <PortfolioAllocation data={dashboardData.allocationData} />
        <div className="col-span-4 lg:col-span-3 flex flex-col gap-4">
          <PerformanceCards
            bestPerformer={dashboardData.bestPerformer}
            worstPerformer={dashboardData.worstPerformer}
          />
          <QuickActions />
        </div>
      </div>

      <RecentTransactions transactions={dashboardData.recentTransactions} />
    </div>
  );
}
