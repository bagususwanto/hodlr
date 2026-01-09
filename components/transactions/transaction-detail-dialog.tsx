"use client";

import { Transaction } from "@/lib/db/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
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
import { useDeleteTransaction } from "@/hooks/use-transactions";
import { toast } from "sonner";
import { useState } from "react";
import { TransactionForm } from "./transaction-form";

interface TransactionDetailDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailDialog({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailDialogProps) {
  const { deleteTransaction } = useDeleteTransaction();
  const [isEditing, setIsEditing] = useState(false);

  if (!transaction) return null;

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction.id);
      toast.success("Transaction deleted successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete transaction");
      console.error(error);
    }
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) setIsEditing(false);
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Transaction" : "Transaction Details"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to your transaction here."
              : `View details of your transaction on ${format(
                  new Date(transaction.date),
                  "PPP"
                )}.`}
          </DialogDescription>
        </DialogHeader>

        {isEditing ? (
          <TransactionForm
            transaction={transaction}
            defaultAssetId={transaction.assetId}
            onSuccess={handleEditSuccess}
          />
        ) : (
          <>
            <div className="grid gap-4 py-4 text-sm">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-muted-foreground">Type</span>
                <span className="col-span-3">
                  <Badge
                    variant={
                      transaction.type === "BUY"
                        ? "default"
                        : transaction.type === "SELL"
                        ? "destructive"
                        : "secondary"
                    }>
                    {transaction.type}
                  </Badge>
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-muted-foreground">
                  Quantity
                </span>
                <span className="col-span-3">{transaction.quantity}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-muted-foreground">Price</span>
                <span className="col-span-3">
                  {formatCurrency(transaction.price)}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-muted-foreground">Total</span>
                <span className="col-span-3 font-semibold">
                  {formatCurrency(transaction.totalValue)}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-muted-foreground">Fee</span>
                <span className="col-span-3">
                  {transaction.fee ? formatCurrency(transaction.fee) : "-"}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-muted-foreground">Date</span>
                <span className="col-span-3">
                  {format(new Date(transaction.date), "Pd")}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-muted-foreground">Tags</span>
                <div className="col-span-3 flex flex-wrap gap-1">
                  {transaction.tags && transaction.tags.length > 0
                    ? transaction.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))
                    : "-"}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <span className="font-medium text-muted-foreground py-1">
                  Notes
                </span>
                <span className="col-span-3 whitespace-pre-wrap">
                  {transaction.notes || "-"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}>
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
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this transaction.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className={buttonVariants({ variant: "destructive" })}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
