import { Card, CardContent } from "@/components/ui/card";

interface AssetStatCardProps {
  label: string;
  value: React.ReactNode;
  subValue?: React.ReactNode;
}

export function AssetStatCard({ label, value, subValue }: AssetStatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        <div className="mt-2 text-xl md:text-2xl font-bold wrap-break-word">
          {value}
        </div>
        {subValue && <div className="mt-1">{subValue}</div>}
      </CardContent>
    </Card>
  );
}
