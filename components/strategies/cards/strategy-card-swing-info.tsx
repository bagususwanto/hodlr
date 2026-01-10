import { Strategy } from "@/lib/db/schema";
import { useCurrency } from "@/hooks/use-formatters";

interface StrategyCardSwingInfoProps {
  strategy: Strategy;
}

export function StrategyCardSwingInfo({
  strategy,
}: StrategyCardSwingInfoProps) {
  const { formatCurrency } = useCurrency();

  if (strategy.type !== "SWING") return null;

  return (
    <div className="text-sm space-y-1">
      {strategy.config.entryZone && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Entry:</span>
          <span>
            {formatCurrency(strategy.config.entryZone.min)} -{" "}
            {formatCurrency(strategy.config.entryZone.max)}
          </span>
        </div>
      )}
      {strategy.config.takeProfit != null && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">TP:</span>
          <span className="text-green-500">
            {formatCurrency(strategy.config.takeProfit)}
          </span>
        </div>
      )}
      {strategy.config.stopLoss != null && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">SL:</span>
          <span className="text-red-500">
            {formatCurrency(strategy.config.stopLoss)}
          </span>
        </div>
      )}
      {strategy.config.totalAllocation != null && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Alloc:</span>
          <span>{formatCurrency(strategy.config.totalAllocation)}</span>
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
  );
}
