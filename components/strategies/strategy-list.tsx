"use client";

import { Strategy } from "@/lib/db/schema";
import { StrategyTable } from "./list/strategy-table";
import { StrategyMobileList } from "./list/strategy-mobile-list";
import { useDeleteStrategy, useUpdateStrategy } from "@/hooks/use-strategies";
import { StrategyDetailDialog } from "./strategy-detail-dialog";
import { useState } from "react";
import { toast } from "sonner";

interface StrategyListProps {
  strategies: Strategy[];
  onEdit: (strategy: Strategy) => void;
}

export function StrategyList({ strategies, onEdit }: StrategyListProps) {
  const { deleteStrategy } = useDeleteStrategy();
  const { updateStrategy } = useUpdateStrategy();

  const [viewStrategyId, setViewStrategyId] = useState<string | null>(null);

  const strategyToView =
    strategies.find((s) => s.id === viewStrategyId) || null;

  const handleDelete = async (id: string) => {
    try {
      await deleteStrategy(id);
      toast.success("Strategy deleted");
      if (viewStrategyId === id) {
        setViewStrategyId(null);
      }
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
    <>
      <div className="space-y-4">
        <div className="md:hidden">
          <StrategyMobileList
            strategies={strategies}
            onViewDetails={(strategy) => setViewStrategyId(strategy.id)}
            onEdit={onEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        </div>
        <div className="hidden md:block">
          <StrategyTable
            strategies={strategies}
            onViewDetails={(strategy) => setViewStrategyId(strategy.id)}
            onEdit={onEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </div>

      <StrategyDetailDialog
        strategy={strategyToView}
        open={!!strategyToView}
        onOpenChange={(open) => !open && setViewStrategyId(null)}
        onEdit={onEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    </>
  );
}
