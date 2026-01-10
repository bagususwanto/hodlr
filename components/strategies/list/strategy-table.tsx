import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Strategy } from "@/lib/db/schema";
import { useAssets } from "@/hooks/use-assets";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Pause, Play } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// StrategyCardActions import removed
// Individual fetching in a list might be bad for performance if not optimized.
// Let's create a row component to handle individual hooks if needed, or better, pass stats map.
// For now, let's use a Row component to encapsulate hook usage.

interface StrategyTableProps {
  strategies: Strategy[];
  onViewDetails: (strategy: Strategy) => void;
  onEdit: (strategy: Strategy) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (strategy: Strategy) => void;
}

export function StrategyTable({
  strategies,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
}: StrategyTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Asset</TableHead>
            <TableHead className="text-right">Invested</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {strategies.map((strategy) => (
            <StrategyTableRow
              key={strategy.id}
              strategy={strategy}
              onClick={() => onViewDetails(strategy)}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import { useAsset } from "@/hooks/use-assets";
import { useStrategyStats } from "@/hooks/use-strategy-stats";

import { useCurrency, useDateFormatter } from "@/hooks/use-formatters";

function StrategyTableRow({
  strategy,
  onClick,
  onEdit,
  onDelete,
  onToggleStatus,
}: {
  strategy: Strategy;
  onClick: () => void;
  onEdit: (strategy: Strategy) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (strategy: Strategy) => void;
}) {
  const { asset } = useAsset(strategy.assetId || "");
  const { stats } = useStrategyStats(strategy.id);
  const { formatCurrency } = useCurrency();
  const { formatDate } = useDateFormatter();

  const statusColor =
    strategy.status === "ACTIVE"
      ? "default"
      : strategy.status === "PAUSED"
      ? "secondary"
      : "outline";

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}>
      <TableCell className="font-medium">{strategy.name}</TableCell>
      <TableCell>
        <Badge variant={statusColor}>{strategy.status}</Badge>
      </TableCell>
      <TableCell className="capitalize">
        {strategy.type.replace("_", " ").toLowerCase()}
      </TableCell>
      <TableCell>{asset ? `${asset.name} (${asset.symbol})` : "-"}</TableCell>
      <TableCell className="text-right">
        {formatCurrency(stats?.totalInvested || 0)}
      </TableCell>
      <TableCell>{formatDate(strategy.startDate)}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(strategy);
            }}>
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(strategy);
            }}>
            {strategy.status === "ACTIVE" ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={(e) => e.stopPropagation()}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  strategy <span className="font-bold">{strategy.name}</span>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(strategy.id);
                  }}
                  className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}
