import { Strategy } from "@/lib/db/schema";

interface StrategyCardDcaInfoProps {
  strategy: Strategy;
}

export function StrategyCardDcaInfo({ strategy }: StrategyCardDcaInfoProps) {
  if (strategy.type !== "DCA") return null;

  return (
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
          <span className="capitalize">{strategy.config.frequency}</span>
        </div>
      )}
    </div>
  );
}
