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
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { useAssets } from "@/hooks/use-assets";
// Removed unused import
// Individual fetching in a list might be bad for performance if not optimized.
// Let's create a row component to handle individual hooks if needed, or better, pass stats map.
// For now, let's use a Row component to encapsulate hook usage.

interface StrategyTableProps {
  strategies: Strategy[];
  onViewDetails: (strategy: Strategy) => void;
}

export function StrategyTable({
  strategies,
  onViewDetails,
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {strategies.map((strategy) => (
            <StrategyTableRow
              key={strategy.id}
              strategy={strategy}
              onClick={() => onViewDetails(strategy)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import { useAsset } from "@/hooks/use-assets";
// StrategyCardActions import removed
import { useStrategyStats } from "@/hooks/use-strategy-stats";

function StrategyTableRow({
  strategy,
  onClick,
}: {
  strategy: Strategy;
  onClick: () => void;
}) {
  const { asset } = useAsset(strategy.assetId || "");
  const { stats } = useStrategyStats(strategy.id);

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
      <TableCell>
        {format(new Date(strategy.startDate), "MMM d, yyyy")}
      </TableCell>
    </TableRow>
  );
}
