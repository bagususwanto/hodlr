"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Asset } from "@/lib/db/schema";

interface AssetSummaryProps {
  asset: Asset;
}

export function AssetSummary({ asset }: AssetSummaryProps) {
  // Placeholders until we have transaction data
  const holdings = 0;
  const avgCost = 0;
  const totalInvested = 0;
  const realizedPnL = 0;
  const realizedPnLPercent = 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Holdings
          </div>
          <div className="mt-2 text-2xl font-bold">
            {holdings} {asset.symbol}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Average Cost
          </div>
          <div className="mt-2 text-2xl font-bold">
            {formatCurrency(avgCost)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Total Invested
          </div>
          <div className="mt-2 text-2xl font-bold">
            {formatCurrency(totalInvested)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Realized P&L
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold ${
                realizedPnL >= 0 ? "text-green-500" : "text-red-500"
              }`}>
              {realizedPnL >= 0 ? "+" : ""}
              {formatCurrency(realizedPnL)}
            </span>
            <span
              className={`text-sm ${
                realizedPnLPercent >= 0 ? "text-green-500" : "text-red-500"
              }`}>
              ({realizedPnLPercent >= 0 ? "+" : ""}
              {realizedPnLPercent}%)
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
