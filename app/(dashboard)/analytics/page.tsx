export default function AnalyticsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          View portfolio performance and statistics.
        </p>
      </div>
    </div>
  );
}
