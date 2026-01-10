"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrophyIcon,
  ThumbsDownIcon,
} from "lucide-react";

interface PerformanceItem {
  name: string;
  symbol: string;
  pnl: number;
  pnlPercentage: number;
}

interface PerformanceCardsProps {
  bestPerformer?: PerformanceItem;
  worstPerformer?: PerformanceItem;
}

export function PerformanceCards({
  bestPerformer,
  worstPerformer,
}: PerformanceCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Best Performer</CardTitle>
          <TrophyIcon className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          {bestPerformer ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold">{bestPerformer.symbol}</span>
                <span className="text-xs text-muted-foreground">
                  {bestPerformer.name}
                </span>
              </div>
              <div className="text-2xl font-bold text-green-500">
                +{formatCurrency(bestPerformer.pnl)}
              </div>
              <p className="text-xs text-muted-foreground">
                <ArrowUpIcon className="mr-1 inline h-3 w-3 text-green-500" />+
                {bestPerformer.pnlPercentage.toFixed(2)}%
              </p>
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center text-sm text-muted-foreground">
              No data
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Worst Performer</CardTitle>
          <ThumbsDownIcon className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          {worstPerformer ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold">{worstPerformer.symbol}</span>
                <span className="text-xs text-muted-foreground">
                  {worstPerformer.name}
                </span>
              </div>
              <div className="text-2xl font-bold text-red-500">
                {formatCurrency(worstPerformer.pnl)}
              </div>
              <p className="text-xs text-muted-foreground">
                <ArrowDownIcon className="mr-1 inline h-3 w-3 text-red-500" />
                {worstPerformer.pnlPercentage.toFixed(2)}%
              </p>
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center text-sm text-muted-foreground">
              No data
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
