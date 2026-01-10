import { Strategy } from "@/lib/db/schema";
import { StrategyCard } from "../strategy-card";

interface StrategyMobileListProps {
  strategies: Strategy[];
  onViewDetails: (strategy: Strategy) => void;
  onEdit: (strategy: Strategy) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (strategy: Strategy) => void;
}

export function StrategyMobileList({
  strategies,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
}: StrategyMobileListProps) {
  return (
    <div className="grid gap-4 grid-cols-1">
      {strategies.map((strategy) => (
        <StrategyCard
          key={strategy.id}
          strategy={strategy}
          onClick={() => onViewDetails(strategy)}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
}
