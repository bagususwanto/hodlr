"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Strategy } from "@/lib/db/schema";
import { format } from "date-fns";
import { useAsset } from "@/hooks/use-assets";
// Imports removed

interface StrategyCardProps {
  strategy: Strategy;
  onClick: () => void;
}

export function StrategyCard({ strategy, onClick }: StrategyCardProps) {
  const { asset } = useAsset(strategy.assetId || "");

  const statusColor =
    strategy.status === "ACTIVE"
      ? "default"
      : strategy.status === "PAUSED"
      ? "secondary"
      : "outline";

  return (
    <Card
      className="flex flex-col h-full cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{strategy.name}</CardTitle>
        <Badge variant={statusColor}>{strategy.status}</Badge>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex flex-col gap-1">
          <div className="text-xl font-bold">
            {strategy.type.replace("_", " ")}
          </div>
          {asset && (
            <p className="text-xs text-muted-foreground">
              Asset: {asset.name} ({asset.symbol})
            </p>
          )}
          <p className="text-xs text-muted-foreground pt-1">
            Started: {format(new Date(strategy.startDate), "PP")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
