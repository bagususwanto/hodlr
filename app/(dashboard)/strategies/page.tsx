"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssets } from "@/hooks/use-assets";
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
  const { assets } = useAssets();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<
    Strategy | undefined
  >(undefined);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const filteredStrategies = strategies?.filter((strategy) => {
    const asset = assets?.find((a) => a.id === strategy.assetId);
    const searchLower = searchQuery.toLowerCase();

    const matchesSearch =
      strategy.name.toLowerCase().includes(searchLower) ||
      (asset &&
        (asset.name.toLowerCase().includes(searchLower) ||
          asset.symbol.toLowerCase().includes(searchLower)));

    const matchesType = typeFilter === "ALL" || strategy.type === typeFilter;

    return matchesSearch && matchesType;
  });

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

      <div className="grid gap-4 p-2 md:flex md:items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or asset..."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="DCA">DCA</SelectItem>
            <SelectItem value="SWING">Swing Trading</SelectItem>
            <SelectItem value="VALUE">Value Investing</SelectItem>
            <SelectItem value="GROWTH">Growth Investing</SelectItem>
            <SelectItem value="DIVIDEND">Dividend Quality</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 rounded-xl bg-muted/10 p-4">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <StrategyList
            strategies={filteredStrategies || []}
            onEdit={handleEdit}
          />
        )}
      </div>
    </div>
  );
}
