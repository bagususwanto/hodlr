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
import { AssetList } from "./components/asset-list";
import { AssetForm } from "./components/asset-form";
import { Asset } from "@/lib/db/schema";

export default function AssetsPage() {
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Assets</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Asset
        </Button>
      </div>

      <AssetList onEdit={handleEdit} />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
          <AssetForm asset={selectedAsset} onSuccess={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
