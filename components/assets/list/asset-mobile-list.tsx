import { Asset } from "@/lib/db/schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssetActions } from "./asset-actions";

interface AssetMobileListProps {
  assets: Asset[];
  onRowClick: (id: string) => void;
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
}

export function AssetMobileList({
  assets,
  onRowClick,
  onEdit,
  onDelete,
}: AssetMobileListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {assets.map((asset) => (
        <Card
          key={asset.id}
          className="cursor-pointer transition-colors hover:bg-muted/50"
          onClick={() => onRowClick(asset.id)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex flex-col">
              <span className="font-bold text-lg">{asset.symbol}</span>
              <span className="text-xs text-muted-foreground">
                {asset.name}
              </span>
            </div>
            <Badge variant="outline" className="capitalize">
              {asset.category}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <span className="text-muted-foreground">Exchange: </span>
              <span className="font-medium">{asset.exchange || "-"}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-0">
            <div onClick={(e) => e.stopPropagation()}>
              <AssetActions asset={asset} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
