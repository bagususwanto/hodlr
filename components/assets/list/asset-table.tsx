"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Asset } from "@/lib/db/schema";
import { AssetActions } from "./asset-actions";

interface AssetTableProps {
  assets: Asset[];
  onRowClick: (id: string) => void;
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
}

export function AssetTable({
  assets,
  onRowClick,
  onEdit,
  onDelete,
}: AssetTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Exchange</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            assets.map((asset) => (
              <TableRow
                key={asset.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onRowClick(asset.id)}>
                <TableCell className="font-medium">{asset.symbol}</TableCell>
                <TableCell>{asset.name}</TableCell>
                <TableCell className="capitalize">{asset.category}</TableCell>
                <TableCell>{asset.exchange || "-"}</TableCell>
                <TableCell className="text-right">
                  <AssetActions
                    asset={asset}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
