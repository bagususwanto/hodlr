import { Strategy } from "@/lib/db/schema";
import { StrategyCard } from "../strategy-card";

interface StrategyMobileListProps {
  strategies: Strategy[];
  onViewDetails: (strategy: Strategy) => void;
}

export function StrategyMobileList({
  strategies,
  onViewDetails,
}: StrategyMobileListProps) {
  return (
    <div className="grid gap-4 grid-cols-1">
      {strategies.map((strategy) => (
        <StrategyCard
          key={strategy.id}
          strategy={strategy}
          onClick={() => onViewDetails(strategy)}
        />
      ))}
    </div>
  );
}
