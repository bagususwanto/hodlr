import { Button } from "@/components/ui/button";
import { Strategy } from "@/lib/db/schema";
import { Edit, Pause, Play, Trash2 } from "lucide-react";

interface StrategyCardActionsProps {
  strategy: Strategy;
  onEdit: (strategy: Strategy) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (strategy: Strategy) => void;
}

export function StrategyCardActions({
  strategy,
  onEdit,
  onDelete,
  onToggleStatus,
}: StrategyCardActionsProps) {
  return (
    <div className="flex justify-end gap-2 mt-auto pt-4">
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
  );
}
