import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Strategy } from "@/lib/db/schema";
import { format } from "date-fns";
import { useAsset } from "@/hooks/use-assets";
import { StrategyCardDcaInfo } from "./cards/strategy-card-dca-info";
import { StrategyCardSwingInfo } from "./cards/strategy-card-swing-info";
import { StrategyCardStats } from "./cards/strategy-card-stats";
import { StrategyCardActions } from "./cards/strategy-card-actions";

interface StrategyDetailDialogProps {
  strategy: Strategy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (strategy: Strategy) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (strategy: Strategy) => void;
}

export function StrategyDetailDialog({
  strategy,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onToggleStatus,
}: StrategyDetailDialogProps) {
  const { asset } = useAsset(strategy?.assetId || "");

  if (!strategy) return null;

  const statusColor =
    strategy.status === "ACTIVE"
      ? "default"
      : strategy.status === "PAUSED"
      ? "secondary"
      : "outline";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] md:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mr-8">
            <DialogTitle>{strategy.name}</DialogTitle>
            <Badge variant={statusColor}>{strategy.status}</Badge>
          </div>
          <DialogDescription>
            {strategy.type.replace("_", " ")} Strategy
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              Asset
            </h4>
            <p className="font-medium">
              {asset ? `${asset.name} (${asset.symbol})` : "No Asset"}
            </p>
          </div>

          <div className="space-y-2 border rounded-md p-3 bg-muted/20">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              Configuration
            </h4>
            <StrategyCardDcaInfo strategy={strategy} />
            <StrategyCardSwingInfo strategy={strategy} />
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              Performance
            </h4>
            <StrategyCardStats
              strategyId={strategy.id}
              assetSymbol={asset?.symbol}
            />
          </div>

          <div className="text-xs text-muted-foreground pt-2 border-t">
            Creating Date: {format(new Date(strategy.startDate), "PPP")}
          </div>

          <StrategyCardActions
            strategy={strategy}
            onEdit={(s) => {
              onEdit(s);
              onOpenChange(false);
            }}
            onDelete={(id) => {
              onDelete(id);
              onOpenChange(false);
            }}
            onToggleStatus={onToggleStatus}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
