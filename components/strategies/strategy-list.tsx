"use client";

import { Strategy } from "@/lib/db/schema";
import { StrategyCard } from "./strategy-card";
import { useDeleteStrategy, useUpdateStrategy } from "@/hooks/use-strategies";
import { toast } from "sonner";

interface StrategyListProps {
  strategies: Strategy[];
  onEdit: (strategy: Strategy) => void;
}

export function StrategyList({ strategies, onEdit }: StrategyListProps) {
  const { deleteStrategy } = useDeleteStrategy();
  const { updateStrategy } = useUpdateStrategy();

  const handleDelete = async (id: string) => {
    try {
      await deleteStrategy(id);
      toast.success("Strategy deleted");
    } catch (error) {
      toast.error("Failed to delete strategy.");
    }
  };

  const handleToggleStatus = async (strategy: Strategy) => {
    try {
      const newStatus = strategy.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
      await updateStrategy(strategy.id, { status: newStatus });
      toast.success(`Strategy is now ${newStatus.toLowerCase()}.`);
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  if (!strategies.length) {
    return (
      <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">No strategies</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            You haven't created any investment strategies yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {strategies.map((strategy) => (
        <StrategyCard
          key={strategy.id}
          strategy={strategy}
          onEdit={onEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      ))}
    </div>
  );
}
