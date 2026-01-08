"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Strategy } from "@/lib/db/schema";
import { format } from "date-fns";
import { Play, Pause, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAsset } from "@/hooks/use-assets";

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{strategy.name}</CardTitle>
        <Badge variant={statusColor}>{strategy.status}</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="text-2xl font-bold">
            {strategy.type.replace("_", " ")}
          </div>
          {asset && (
            <p className="text-xs text-muted-foreground">
              Asset: {asset.name} ({asset.symbol})
            </p>
          )}

          {strategy.type === "DCA" && (
            <div className="text-sm space-y-1">
              {strategy.config.amount != null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(strategy.config.amount)}
                  </span>
                </div>
              )}
              {strategy.config.frequency && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Freq:</span>
                  <span className="capitalize">
                    {strategy.config.frequency}
                  </span>
                </div>
              )}
            </div>
          )}

          {strategy.type === "SWING" && (
            <div className="text-sm space-y-1">
              {strategy.config.entryZone && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Entry:</span>
                  <span>
                    {strategy.config.entryZone.min} -{" "}
                    {strategy.config.entryZone.max}
                  </span>
                </div>
              )}
              {strategy.config.takeProfit != null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TP:</span>
                  <span className="text-green-500">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(strategy.config.takeProfit)}
                  </span>
                </div>
              )}
              {strategy.config.stopLoss != null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SL:</span>
                  <span className="text-red-500">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(strategy.config.stopLoss)}
                  </span>
                </div>
              )}
              {strategy.config.totalAllocation != null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Alloc:</span>
                  <span>{strategy.config.totalAllocation}</span>
                </div>
              )}
              {strategy.config.entryPlan && (
                <div className="pt-2">
                  <span className="text-xs text-muted-foreground block mb-1">
                    Entry Plan:
                  </span>
                  <p className="text-xs whitespace-pre-wrap bg-muted p-2 rounded-md">
                    {strategy.config.entryPlan}
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground pt-2 border-t mt-2">
            Started: {format(new Date(strategy.startDate), "PP")}
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onToggleStatus(strategy)}>
              {strategy.status === "ACTIVE" ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(strategy)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(strategy.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
