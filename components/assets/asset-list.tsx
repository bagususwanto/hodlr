"use client";

import { useDeleteAsset } from "@/hooks/use-assets";
import { Asset } from "@/lib/db/schema";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AssetFilters } from "./list/asset-filters";
import { AssetTable } from "./list/asset-table";
import { AssetMobileList } from "./list/asset-mobile-list";

export interface AssetListProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
}

import { PaginationControls } from "@/components/ui/pagination-controls";

export function AssetList({ assets, onEdit }: AssetListProps) {
  const router = useRouter();
  const { deleteAsset } = useDeleteAsset();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || asset.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Pagination Logic
  const totalCount = filteredAssets.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const currentPage = page > totalPages && totalPages > 0 ? totalPages : page;

  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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

  if (!assets.length) {
    return (
      <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">No assets</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            You haven't added any assets to your portfolio yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AssetFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />
      <div className="md:hidden">
        <AssetMobileList
          assets={paginatedAssets}
          onRowClick={handleRowClick}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      </div>
      <div className="hidden md:block">
        <AssetTable
          assets={paginatedAssets}
          onRowClick={handleRowClick}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
