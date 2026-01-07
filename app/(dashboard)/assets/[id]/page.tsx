"use client";

import { useAsset, useDeleteAsset, useUpdateAsset } from "@/hooks/use-assets";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AssetSummary } from "../components/asset-summary";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { AssetForm } from "../components/asset-form";
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
import { toast } from "sonner";
import { use } from "react";

interface AssetDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function AssetDetailPage({ params }: AssetDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { asset, isLoading } = useAsset(resolvedParams.id);
  const { deleteAsset } = useDeleteAsset();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async () => {
    try {
      if (asset) {
        await deleteAsset(asset.id);
        toast.success("Asset deleted successfully");
        router.push("/assets");
      }
    } catch (error) {
      toast.error("Failed to delete asset");
      console.error(error);
    }
  };

  if (isLoading) {
    return <div>Loading asset...</div>;
  }

  if (!asset) {
    return <div>Asset not found</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {asset.symbol} - {asset.name}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  asset {asset.symbol}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <AssetSummary asset={asset} />

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold leading-none tracking-tight">
            Transaction History
          </h3>
          <p className="text-sm text-muted-foreground">
            History of your transactions for this asset.
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground border border-dashed rounded-lg">
            <p>No transactions found.</p>
            <Button variant="link" className="mt-2">
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>
              Make changes to your asset here.
            </DialogDescription>
          </DialogHeader>
          <AssetForm asset={asset} onSuccess={() => setIsEditOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
