"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { useCurrency } from "@/hooks/use-formatters";

interface DashboardStatsProps {
  totalValue: number;
  realizedPnL: number;
  investedValue: number;
}

export function DashboardStats({
  totalValue,
  realizedPnL,
  investedValue,
}: DashboardStatsProps) {
  const { formatCurrency } = useCurrency();
  const unrealizedPnL = totalValue - investedValue;
  // If investedValue is 0, we can't calculate percentage, default to 0
  const unrealizedPnLPercentage =
    investedValue > 0 ? (unrealizedPnL / investedValue) * 100 : 0;

  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Portfolio Value
          </CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          <p className="text-xs text-muted-foreground">
            {unrealizedPnL >= 0 ? "+" : ""}
            {formatCurrency(unrealizedPnL)} (
            {unrealizedPnLPercentage.toFixed(2)}
            %) unrealized
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Realized P&L</CardTitle>
          {realizedPnL >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingUp className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              realizedPnL >= 0 ? "text-green-500" : "text-red-500"
            }`}>
            {realizedPnL >= 0 ? "+" : ""}
            {formatCurrency(realizedPnL)}
          </div>
          <p className="text-xs text-muted-foreground">
            Lifetime realized profit/loss
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
