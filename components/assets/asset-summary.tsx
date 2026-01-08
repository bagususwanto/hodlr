import { formatCurrency } from "@/lib/utils";
import { Asset } from "@/lib/db/schema";
import { useAssetStats } from "@/hooks/use-asset-stats";
import { AssetStatCard } from "./cards/asset-stat-card";

interface AssetSummaryProps {
  asset: Asset;
}

export function AssetSummary({ asset }: AssetSummaryProps) {
  const { holdings, avgCost, totalInvested, realizedPnL, realizedPnLPercent } =
    useAssetStats(asset.id);

  // Helper helper to format percentage
  const formatPercent = (val: number) => {
    return val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const pnlColor = realizedPnL >= 0 ? "text-green-500" : "text-red-500";
  const pnlPercentColor =
    realizedPnLPercent >= 0 ? "text-green-500" : "text-red-500";

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
      <AssetStatCard label="Holdings" value={`${holdings} ${asset.symbol}`} />
      <AssetStatCard label="Average Cost" value={formatCurrency(avgCost)} />
      <AssetStatCard
        label="Total Invested"
        value={formatCurrency(totalInvested)}
      />
      <AssetStatCard
        label="Realized P&L"
        value={
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${pnlColor}`}>
              {realizedPnL >= 0 ? "+" : ""}
              {formatCurrency(realizedPnL)}
            </span>
            <span className={`text-sm ${pnlPercentColor}`}>
              ({realizedPnLPercent >= 0 ? "+" : ""}
              {formatPercent(realizedPnLPercent)}%)
            </span>
          </div>
        }
      />
    </div>
  );
}
