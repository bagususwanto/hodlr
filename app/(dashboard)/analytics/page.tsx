"use client";

import { MetricsCards } from "@/components/analytics/metrics-cards";
import { PeriodFilter } from "@/components/analytics/period-filter";
import { useAnalytics } from "@/hooks/use-analytics";
import { Separator } from "@/components/ui/separator";
import { ChartsSection } from "@/components/analytics/charts-section";

export default function AnalyticsPage() {
  const { period, setPeriod, metrics, isLoading } = useAnalytics();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            In-depth analysis of your portfolio performance.
          </p>
        </div>
        <PeriodFilter value={period} onChange={setPeriod} />
      </div>

      <Separator />

      <MetricsCards metrics={metrics} isLoading={isLoading} />

      <ChartsSection
        historyData={metrics?.historyData || []}
        allocationData={metrics?.allocationData || []}
      />
    </div>
  );
}
