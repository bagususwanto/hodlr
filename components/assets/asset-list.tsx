"use client";

import { useAssets, useDeleteAsset } from "@/hooks/use-assets";
import { Asset } from "@/lib/db/schema";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AssetFilters } from "./list/asset-filters";
import { AssetTable } from "./list/asset-table";

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
      <AssetFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />
      <AssetTable
        assets={filteredAssets || []}
        onRowClick={handleRowClick}
        onEdit={onEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
