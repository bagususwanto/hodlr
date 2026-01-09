"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssetFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
}

export function AssetFilters({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
}: AssetFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <Input
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full md:max-w-xl"
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
  );
}
