import { Strategy } from "@/lib/db/schema";
import { useCurrency } from "@/hooks/use-formatters";

interface StrategyCardDcaInfoProps {
  strategy: Strategy;
}

export function StrategyCardDcaInfo({ strategy }: StrategyCardDcaInfoProps) {
  const { formatCurrency } = useCurrency();

  if (strategy.type !== "DCA") return null;

  return (
    <div className="text-sm space-y-1">
      {strategy.config.amount != null && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Amount:</span>
          <span className="font-medium">
            {formatCurrency(strategy.config.amount)}
          </span>
        </div>
      )}
      {strategy.config.frequency && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Freq:</span>
          <span className="capitalize">{strategy.config.frequency}</span>
        </div>
      )}
    </div>
  );
}
