"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Strategy } from "@/lib/db/schema";
import { format } from "date-fns";
import { useAsset } from "@/hooks/use-assets";
import { StrategyCardDcaInfo } from "./cards/strategy-card-dca-info";
import { StrategyCardSwingInfo } from "./cards/strategy-card-swing-info";
import { StrategyCardStats } from "./cards/strategy-card-stats";
import { StrategyCardActions } from "./cards/strategy-card-actions";

interface StrategyCardProps {
  strategy: Strategy;
  onEdit: (strategy: Strategy) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (strategy: Strategy) => void;
}

export function StrategyCard({
  strategy,
  onEdit,
  onDelete,
  onToggleStatus,
}: StrategyCardProps) {
  const { asset } = useAsset(strategy.assetId || "");

  const statusColor =
    strategy.status === "ACTIVE"
      ? "default"
      : strategy.status === "PAUSED"
      ? "secondary"
      : "outline";

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{strategy.name}</CardTitle>
        <Badge variant={statusColor}>{strategy.status}</Badge>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex flex-col gap-2 flex-1">
          <div className="text-2xl font-bold">
            {strategy.type.replace("_", " ")}
          </div>
          {asset && (
            <p className="text-xs text-muted-foreground">
              Asset: {asset.name} ({asset.symbol})
            </p>
          )}

          <StrategyCardDcaInfo strategy={strategy} />
          <StrategyCardSwingInfo strategy={strategy} />

          <p className="text-xs text-muted-foreground pt-2 border-t mt-2">
            Started: {format(new Date(strategy.startDate), "PP")}
          </p>

          <StrategyCardStats
            strategyId={strategy.id}
            assetSymbol={asset?.symbol}
          />

          <StrategyCardActions
            strategy={strategy}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
          />
        </div>
      </CardContent>
    </Card>
  );
}
