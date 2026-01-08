"use client";

import { TrendingUp, Wallet } from "lucide-react";
import { useStrategyStats } from "@/hooks/use-strategy-stats";

interface StrategyCardStatsProps {
  strategyId: string;
  assetSymbol?: string;
}

export function StrategyCardStats({
  strategyId,
  assetSymbol,
}: StrategyCardStatsProps) {
  const { stats } = useStrategyStats(strategyId);

  return (
    <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs">
      <div className="flex flex-col">
        <span className="text-muted-foreground flex items-center gap-1">
          <Wallet className="h-3 w-3" /> Invested
        </span>
        <span className="font-medium">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(stats?.totalInvested || 0)}
        </span>
      </div>
      <div className="flex flex-col text-right">
        <span className="text-muted-foreground flex items-center justify-end gap-1">
          <TrendingUp className="h-3 w-3" /> Quantity
        </span>
        <span className="font-medium">
          {stats?.totalQuantity || 0} {assetSymbol}
        </span>
      </div>
    </div>
  );
}
