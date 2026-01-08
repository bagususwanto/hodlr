"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AssetList } from "@/components/assets/asset-list";
import { AssetForm } from "@/components/assets/asset-form";
import { Asset } from "@/lib/db/schema";
import { useAssets } from "@/hooks/use-assets";
import { Skeleton } from "@/components/ui/skeleton";

export default function AssetsPage() {
  const { assets, isLoading } = useAssets();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>(
    undefined
  );

  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsOpen(true);
  };

  const handleAdd = () => {
    setSelectedAsset(undefined);
    setIsOpen(true);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between p-2">
        <div>
          <h1 className="text-2xl font-bold">Assets</h1>
          <p className="text-muted-foreground">Manage your assets here.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedAsset ? "Edit Asset" : "Add Asset"}
              </DialogTitle>
              <DialogDescription>
                {selectedAsset
                  ? "Make changes to your asset here."
                  : "Add a new asset to your portfolio."}
              </DialogDescription>
            </DialogHeader>
            <AssetForm
              asset={selectedAsset}
              onSuccess={() => setIsOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 rounded-xl bg-muted/10 p-4">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <AssetList assets={assets || []} onEdit={handleEdit} />
        )}
      </div>
    </div>
  );
}
