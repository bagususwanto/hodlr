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
import { TransactionForm } from "./transaction-form";

interface AddTransactionDialogProps {
  defaultAssetId?: string;
  children?: React.ReactNode;
}

export function AddTransactionDialog({
  defaultAssetId,
  children,
}: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Record a new buy, sell, or swap transaction.
          </DialogDescription>
        </DialogHeader>
        <TransactionForm
          onSuccess={() => setOpen(false)}
          defaultAssetId={defaultAssetId}
        />
      </DialogContent>
    </Dialog>
  );
}
