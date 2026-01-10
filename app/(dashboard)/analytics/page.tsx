"use client";

import { MetricsCards } from "@/components/analytics/metrics-cards";
import { PeriodFilter } from "@/components/analytics/period-filter";
import { useAnalytics } from "@/hooks/use-analytics";
import { Separator } from "@/components/ui/separator";
import { ChartsSection } from "@/components/analytics/charts-section";
import { ExportButtons } from "@/components/analytics/export-buttons";

export default function AnalyticsPage() {
  const { period, setPeriod, metrics, isLoading, rawData } = useAnalytics();

  // Combine metrics and raw data for report
  const reportData =
    metrics && rawData
      ? {
          ...metrics,
          period,
          portfolioValue: metrics.totalInvested + metrics.realizedPnL, // Simplified approximation if not tracked
          transactions: rawData.transactions,
          holdings: metrics.allocationData.map((a) => ({
            symbol: a.symbol,
            quantity: 0,
            value: a.value,
          })), // Simplified mapping, ideally calculateHoldings
          assets: rawData.assets,
        }
      : null;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <div className="flex items-center space-x-2">
          <ExportButtons data={reportData} />
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>
      </div>

      <Separator />

      <MetricsCards metrics={metrics} isLoading={isLoading} />

      <ChartsSection
        historyData={metrics?.historyData || []}
        allocationData={metrics?.allocationData || []}
        returnPerAssetData={metrics?.returnPerAssetData || []}
      />
    </div>
  );
}
