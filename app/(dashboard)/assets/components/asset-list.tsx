"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAssets, useDeleteAsset } from "@/hooks/use-assets";
import { Asset } from "@/lib/db/schema";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface AssetListProps {
  onEdit: (asset: Asset) => void;
}

export function AssetList({ onEdit }: AssetListProps) {
  const router = useRouter();
  const { assets, isLoading } = useAssets();
  const { deleteAsset } = useDeleteAsset();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredAssets = assets?.filter((asset) => {
    const matchesSearch =
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || asset.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteAsset(id);
      toast.success("Asset deleted successfully");
    } catch (error) {
      toast.error("Failed to delete asset");
      console.error(error);
    }
  };

  const handleRowClick = (id: string) => {
    router.push(`/assets/${id}`);
  };

  if (isLoading) {
    return <div>Loading assets...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Input
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:max-w-sm"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="crypto">Crypto</SelectItem>
            <SelectItem value="stock">Stock</SelectItem>
            <SelectItem value="forex">Forex</SelectItem>
            <SelectItem value="commodity">Commodity</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
            {filteredAssets?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              filteredAssets?.map((asset) => (
                <TableRow
                  key={asset.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(asset.id)}>
                  <TableCell className="font-medium">{asset.symbol}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell className="capitalize">{asset.category}</TableCell>
                  <TableCell>{asset.exchange || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div
                      className="flex justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(asset)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the asset {asset.symbol}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(asset.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
