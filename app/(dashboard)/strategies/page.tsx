"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StrategyList } from "@/components/strategies/strategy-list";
import { StrategyForm } from "@/components/strategies/strategy-form";
import { useStrategies } from "@/hooks/use-strategies";
import { Strategy } from "@/lib/db/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function StrategiesPage() {
  const { strategies, isLoading } = useStrategies();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<
    Strategy | undefined
  >(undefined);

  const handleEdit = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedStrategy(undefined);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between p-2">
        <div>
          <h1 className="text-2xl font-bold">Strategies</h1>
          <p className="text-muted-foreground">
            Manage your investment strategies.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedStrategy(undefined)}>
              <Plus className="mr-2 h-4 w-4" /> New Strategy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedStrategy ? "Edit Strategy" : "New Strategy"}
              </DialogTitle>
              <DialogDescription>
                {selectedStrategy
                  ? "Update the details of your strategy."
                  : "Define a new investment strategy."}
              </DialogDescription>
            </DialogHeader>
            <StrategyForm
              key={selectedStrategy?.id || "new"}
              strategy={selectedStrategy}
              onSuccess={handleClose}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 rounded-xl bg-muted/10 p-4">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <StrategyList strategies={strategies || []} onEdit={handleEdit} />
        )}
      </div>
    </div>
  );
}
