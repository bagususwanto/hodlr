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
  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            View details of your transaction on{" "}
            {format(new Date(transaction.date), "PPP")}.
          </DialogDescription>
        </DialogHeader>
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
            <span className="font-medium text-muted-foreground">Quantity</span>
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
      </DialogContent>
    </Dialog>
  );
}
