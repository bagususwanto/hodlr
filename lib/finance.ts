import { Transaction } from "./db/schema";

/**
 * Calculates the total current holdings of an asset.
 * BUY: Adds to holdings
 * SELL: Subtracts from holdings
 * SWAP: Subtracts from holdings (Assumed as disposal/swap out)
 */
export function calculateHoldings(transactions: Transaction[]): number {
  return transactions.reduce((total, t) => {
    if (t.type === "BUY") {
      return total + t.quantity;
    } else if (t.type === "SELL" || t.type === "SWAP") {
      return total - t.quantity;
    }
    return total;
  }, 0);
}

/**
 * Calculates the weighted average cost per unit.
 * Only BUY transactions contribute to the average cost basis.
 */
export function calculateAverageCost(transactions: Transaction[]): number {
  let totalQuantity = 0;
  let totalCost = 0;

  for (const t of transactions) {
    if (t.type === "BUY") {
      totalQuantity += t.quantity;
      totalCost += t.quantity * t.price; // or t.totalValue
    }
    // SELL/SWAP do not change the Average Cost per unit,
    // they only reduce the Total Cost Basis proportionally.
  }

  return totalQuantity === 0 ? 0 : totalCost / totalQuantity;
}

/**
 * Calculates the total amount currently invested (Cost Basis of current holdings).
 * This is effectively: Current Holdings * Average Cost
 */
export function calculateTotalInvested(transactions: Transaction[]): number {
  const holdings = calculateHoldings(transactions);
  const avgCost = calculateAverageCost(transactions);
  return holdings * avgCost;
}

/**
 * Calculates Realized PnL from SELL and SWAP transactions.
 * Uses Average Cost Basis method.
 * PnL = (Sell Price - Average Cost at time of Sale) * Sell Quantity
 */
export function calculateRealizedPnL(transactions: Transaction[]): {
  realizedPnL: number;
  realizedPnLPercent: number;
} {
  let currentAvgCost = 0;
  let currentQuantity = 0;
  let currentTotalCost = 0;
  let totalRealizedPnL = 0;
  let totalSellCostBasis = 0;

  // We must process transactions in chronological order to get accurate Avg Cost at time of sale
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const t of sortedTransactions) {
    if (t.type === "BUY") {
      currentQuantity += t.quantity;
      currentTotalCost += t.quantity * t.price;
      currentAvgCost = currentTotalCost / currentQuantity;
    } else if (t.type === "SELL" || t.type === "SWAP") {
      // Calculate PnL for this specific trade
      const tradeCostBasis = t.quantity * currentAvgCost;
      const tradeValue = t.quantity * t.price;
      const tradePnL = tradeValue - tradeCostBasis;

      totalRealizedPnL += tradePnL;
      totalSellCostBasis += tradeCostBasis;

      // Update holdings (Avg Cost stays same)
      currentQuantity -= t.quantity;
      currentTotalCost -= tradeCostBasis;

      // Handle edge case if quantity goes to 0 or negative
      if (currentQuantity <= 0) {
        currentQuantity = 0;
        currentTotalCost = 0;
        currentAvgCost = 0; // Reset if fully exited? Or keep historical? Standard is reset if 0.
      }
    }
  }

  // Calculate overall realized PnL % based on cost basis of sold assets
  const realizedPnLPercent =
    totalSellCostBasis === 0
      ? 0
      : (totalRealizedPnL / totalSellCostBasis) * 100;

  return {
    realizedPnL: totalRealizedPnL,
    realizedPnLPercent,
  };
}

/**
 * Calculates the Win Rate percentage (0-100).
 * defined as: (Number of Profitable Trades / Total Closed Trades) * 100
 */
export function calculateWinRate(transactions: Transaction[]): number {
  // Filter for closed trades (SELL or SWAP) that have PnL implications
  // We need to calculate PnL per trade to determine if it was a win or loss.
  // Ideally, we should have a more robust way to track "trades", but for now
  // we will iterate and calculate PnL per disposal.

  const sells = transactions.filter(
    (t) => t.type === "SELL" || t.type === "SWAP"
  );
  if (sells.length === 0) return 0;

  // We need to re-run the PnL calculation loop to identify individual trade outcomes
  // This is a bit inefficient to duplicate logic, but safer to keep stateless here.
  let currentQuantity = 0;
  let currentTotalCost = 0;
  let currentAvgCost = 0;

  let wins = 0;
  let losses = 0; // Includes break-even for denominator, but usually win rate is wins/total

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const t of sortedTransactions) {
    if (t.type === "BUY") {
      currentQuantity += t.quantity;
      currentTotalCost += t.quantity * t.price;
      currentAvgCost =
        currentQuantity > 0 ? currentTotalCost / currentQuantity : 0;
    } else if (t.type === "SELL" || t.type === "SWAP") {
      const tradeCostBasis = t.quantity * currentAvgCost;
      const tradeValue = t.quantity * t.price;
      const tradePnL = tradeValue - tradeCostBasis;

      if (tradePnL > 0) wins++;
      else losses++; // distinct from wins

      // Update holdings
      currentQuantity -= t.quantity;
      currentTotalCost -= tradeCostBasis;
      if (currentQuantity <= 0) {
        currentQuantity = 0;
        currentTotalCost = 0;
        currentAvgCost = 0;
      }
    }
  }

  const totalTrades = wins + losses;
  return totalTrades === 0 ? 0 : (wins / totalTrades) * 100;
}

/**
 * Calculates Average Win and Average Loss.
 */
export function calculateAverageWinLoss(transactions: Transaction[]): {
  avgWin: number;
  avgLoss: number;
} {
  let currentQuantity = 0;
  let currentTotalCost = 0;
  let currentAvgCost = 0;

  let totalWinAmount = 0;
  let winCount = 0;
  let totalLossAmount = 0;
  let lossCount = 0;

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const t of sortedTransactions) {
    if (t.type === "BUY") {
      currentQuantity += t.quantity;
      currentTotalCost += t.quantity * t.price;
      currentAvgCost =
        currentQuantity > 0 ? currentTotalCost / currentQuantity : 0;
    } else if (t.type === "SELL" || t.type === "SWAP") {
      const tradeCostBasis = t.quantity * currentAvgCost;
      const tradeValue = t.quantity * t.price;
      const tradePnL = tradeValue - tradeCostBasis;

      if (tradePnL > 0) {
        totalWinAmount += tradePnL;
        winCount++;
      } else {
        totalLossAmount += tradePnL; // This will be negative
        lossCount++;
      }

      currentQuantity -= t.quantity;
      currentTotalCost -= tradeCostBasis;
      if (currentQuantity <= 0) {
        currentQuantity = 0;
        currentTotalCost = 0;
        currentAvgCost = 0;
      }
    }
  }

  return {
    avgWin: winCount === 0 ? 0 : totalWinAmount / winCount,
    avgLoss: lossCount === 0 ? 0 : totalLossAmount / lossCount,
  };
}

/**
 * Generates data for the Portfolio Value chart (Net Invested Capital over time).
 * Since we don't have historical price data, we track the "Cost Basis" or "Net Invested" amount.
 */
export function generatePortfolioHistory(
  transactions: Transaction[]
): { date: string; value: number }[] {
  if (transactions.length === 0) return [];

  const sortedTxs = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const history: { date: string; value: number }[] = [];
  let currentInvested = 0;

  // We want a continuous line, so we need to fill gaps?
  // For simplicity, we'll just plot points where transactions happened,
  // or maybe daily? Let's do daily for smoother charts if needed,
  // but for now, transaction points + today is enough for a basic chart
  // if we use a stepped line or just direct connections.
  // Actually, Recharts works best with sorted time points.
  // Let's just emit a point for each transaction date (end of day).

  // Better approach: Aggregate by day first.
  const txsByDay = new Map<string, Transaction[]>();

  for (const t of sortedTxs) {
    const dateStr = new Date(t.date).toISOString().split("T")[0];
    const dayTxs = txsByDay.get(dateStr) || [];
    dayTxs.push(t);
    txsByDay.set(dateStr, dayTxs);
  }

  const uniqueDates = Array.from(txsByDay.keys()).sort();

  for (const dateStr of uniqueDates) {
    const dayTxs = txsByDay.get(dateStr)!;

    for (const t of dayTxs) {
      if (t.type === "BUY") {
        currentInvested += t.totalValue;
      } else if (t.type === "SELL" || t.type === "SWAP") {
        // When selling, we reduce "Invested" by the COST BASIS of the sold amount.
        // We know that calculateRealizedPnL logic tracks cost basis.
        // Simplified: We need to subtract (quantity * currentAvgCost).
        // This requires re-calculating running avg cost.
        // Ideally we should refactor the state tracking to be reusable.
        // For this function, let's duplicate the simple "Net Flow" logic
        // OR better: use the proper Cost Basis reduction.
        // Let's use Net Flow (Invested - Withdrawn) ?
        // No, Cost Basis is better for "Value".
        // Re-implementing running average cost loop here:
        // note: this is getting complex to duplicate.
        // Ideally we process everything in one pass.
      }
    }

    // Fallback: Just simple "Net Invested" = Sum(Buy Value) - Sum(Sell Cost Basis)
    // To do this correctly, we need the full iteration state.
  }

  // Alternative: Just return "Total Invested" calculate at each text.
  // We can reuse the loop structure.

  const result: { date: string; value: number }[] = [];

  // Re-run the simulation
  let runningEntries: { quantity: number; totalCost: number } = {
    quantity: 0,
    totalCost: 0,
  };

  // Helper to update state
  const updateState = (t: Transaction, state: typeof runningEntries) => {
    if (t.type === "BUY") {
      state.quantity += t.quantity;
      state.totalCost += t.totalValue;
    } else if (t.type === "SELL" || t.type === "SWAP") {
      const avgCost = state.quantity > 0 ? state.totalCost / state.quantity : 0;
      const costBasisRemoved = t.quantity * avgCost;
      state.quantity -= t.quantity;
      state.totalCost -= costBasisRemoved;
      if (state.quantity <= 0) {
        state.quantity = 0;
        state.totalCost = 0;
      }
    }
    return state;
  };

  let currentState = { quantity: 0, totalCost: 0 }; // This is global "Portfolio" state?
  // No, Avg Cost is PER ASSET. We cannot aggregate different assets cost basis directly
  // unless we track them separately.

  // Correct Algorithm:
  // 1. Map of assetId -> { quantity, totalCost }
  // 2. Iterate all transactions chronological.
  // 3. Update specific asset state.
  // 4. Sum all asset totalCosts to get "Total Invested" at that point.

  const assetStates = new Map<
    string,
    { quantity: number; totalCost: number }
  >();

  for (const dateStr of uniqueDates) {
    const dayTxs = txsByDay.get(dateStr)!;

    for (const t of dayTxs) {
      const state = assetStates.get(t.assetId) || { quantity: 0, totalCost: 0 };

      if (t.type === "BUY") {
        state.quantity += t.quantity;
        state.totalCost += t.totalValue;
      } else if (t.type === "SELL" || t.type === "SWAP") {
        const avgCost =
          state.quantity > 0 ? state.totalCost / state.quantity : 0;
        const costBasisRemoved = t.quantity * avgCost;
        state.quantity -= t.quantity;
        state.totalCost -= costBasisRemoved;
        if (state.quantity <= 0) {
          state.quantity = 0;
          state.totalCost = 0;
        }
      }
      assetStates.set(t.assetId, state);
    }

    // Sum up totalCost of all assets
    let dayTotalInvested = 0;
    for (const s of assetStates.values()) {
      dayTotalInvested += s.totalCost;
    }

    result.push({ date: dateStr, value: dayTotalInvested });
  }

  return result;
}

/**
 * Generates Asset Allocation data for Pie Chart.
 * Returns: { name: string, value: number, symbol: string }[]
 */
export function generateAssetAllocation(
  transactions: Transaction[],
  assets: any[]
): { name: string; value: number; symbol: string }[] {
  const assetStates = new Map<
    string,
    { quantity: number; totalCost: number }
  >();

  // Sort just in case, though order matters for avg cost
  const sortedTxs = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const t of sortedTxs) {
    const state = assetStates.get(t.assetId) || { quantity: 0, totalCost: 0 };

    if (t.type === "BUY") {
      state.quantity += t.quantity;
      state.totalCost += t.totalValue;
    } else if (t.type === "SELL" || t.type === "SWAP") {
      const avgCost = state.quantity > 0 ? state.totalCost / state.quantity : 0;
      const costBasisRemoved = t.quantity * avgCost;
      state.quantity -= t.quantity;
      state.totalCost -= costBasisRemoved;
      if (state.quantity <= 0) {
        state.quantity = 0;
        state.totalCost = 0;
      }
    }
    assetStates.set(t.assetId, state);
  }

  // Map to result
  const result = [];
  for (const [assetId, state] of assetStates.entries()) {
    if (state.totalCost > 0.01) {
      // Filter out empty or dust
      const asset = assets.find((a) => a.id === assetId);
      result.push({
        name: asset?.name || "Unknown",
        symbol: asset?.symbol || "???",
        value: state.totalCost,
      });
    }
  }

  return result.sort((a, b) => b.value - a.value);
}

/**
 * Generates data for Return Per Asset (Bar Chart).
 * Calculates Total Return (Realized + Unrealized) for each asset.
 * Returns: { name: string, value: number, symbol: string }[] sorted by value desc
 */
export function generateReturnPerAsset(
  transactions: Transaction[],
  assets: any[]
): { name: string; value: number; symbol: string }[] {
  // 1. Calculate Realized PnL per asset
  const assetStates = new Map<
    string,
    {
      quantity: number;
      totalCost: number;
      realizedPnL: number;
    }
  >();

  const sortedTxs = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const t of sortedTxs) {
    const state = assetStates.get(t.assetId) || {
      quantity: 0,
      totalCost: 0,
      realizedPnL: 0,
    };

    if (t.type === "BUY") {
      state.quantity += t.quantity;
      state.totalCost += t.quantity * t.price;
    } else if (t.type === "SELL" || t.type === "SWAP") {
      const avgCost = state.quantity > 0 ? state.totalCost / state.quantity : 0;
      const tradeCostBasis = t.quantity * avgCost;
      const tradeValue = t.quantity * t.price;
      const tradePnL = tradeValue - tradeCostBasis;

      state.realizedPnL += tradePnL;
      state.quantity -= t.quantity;
      state.totalCost -= tradeCostBasis;

      if (state.quantity <= 0) {
        state.quantity = 0;
        state.totalCost = 0;
      }
    }
    assetStates.set(t.assetId, state);
  }

  // 2. Return Realized PnL (as we lack current price for Unrealized)
  const result: { name: string; value: number; symbol: string }[] = [];

  for (const [assetId, state] of assetStates.entries()) {
    if (Math.abs(state.realizedPnL) > 0.01) {
      const asset = assets.find((a) => a.id === assetId);
      result.push({
        name: asset?.name || "Unknown",
        symbol: asset?.symbol || "???",
        value: state.realizedPnL,
      });
    }
  }

  return result.sort((a, b) => b.value - a.value);
}
