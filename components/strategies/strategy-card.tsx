"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Strategy } from "@/lib/db/schema";
import { format } from "date-fns";
import { useAsset } from "@/hooks/use-assets";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Pause, Play } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface StrategyCardProps {
  strategy: Strategy;
  onClick: () => void;
  onEdit: (strategy: Strategy) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (strategy: Strategy) => void;
}

export function StrategyCard({
  strategy,
  onClick,
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
        <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(strategy);
            }}>
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
            onClick={(e) => {
              e.stopPropagation();
              onEdit(strategy);
            }}>
            <Edit className="h-4 w-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={(e) => e.stopPropagation()}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  strategy <span className="font-bold">{strategy.name}</span>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(strategy.id);
                  }}
                  className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
