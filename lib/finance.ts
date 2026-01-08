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
