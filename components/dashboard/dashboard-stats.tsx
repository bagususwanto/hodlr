"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

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
  const unrealizedPnL = totalValue - investedValue;
  // If investedValue is 0, we can't calculate percentage, default to 0
  const unrealizedPnLPercentage =
    investedValue > 0 ? (unrealizedPnL / investedValue) * 100 : 0;

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Portfolio Value
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
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
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
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
