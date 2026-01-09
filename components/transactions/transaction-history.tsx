"use client";

import { useState } from "react";
import { Transaction } from "@/lib/db/schema";
import { TransactionDetailDialog } from "./transaction-detail-dialog";
import { useTransactions } from "@/hooks/use-transactions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddTransactionDialog } from "./add-transaction-dialog";
import { useStrategies } from "@/hooks/use-strategies";
import { TransactionMobileList } from "./list/transaction-mobile-list";

interface TransactionHistoryProps {
  assetId: string;
  hideAddButton?: boolean;
}

export function TransactionHistory({
  assetId,
  hideAddButton = false,
}: TransactionHistoryProps) {
  const { transactions, isLoading } = useTransactions(assetId);
  const { strategies } = useStrategies();
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground border border-dashed rounded-lg">
        <p>No transactions found.</p>
        <div className="mt-2">
          <AddTransactionDialog defaultAssetId={assetId}>
            <Button variant="link">
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </AddTransactionDialog>
        </div>
      </div>
    );
  }

  const getStrategyName = (strategyId?: string) => {
    if (!strategyId) return "-";
    const strategy = strategies?.find((s) => s.id === strategyId);
    return strategy ? strategy.name : "Unknown Strategy";
  };

  return (
    <div className="space-y-4">
      {!hideAddButton && (
        <div className="flex justify-end">
          <AddTransactionDialog defaultAssetId={assetId} />
        </div>
      )}
      <div className="md:hidden">
        <TransactionMobileList
          transactions={transactions}
          strategies={strategies || []}
          onRowClick={setSelectedTransaction}
        />
      </div>
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Strategy</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Fee</TableHead>
              <TableHead>Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedTransaction(transaction)}>
                <TableCell>
                  {format(new Date(transaction.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>{getStrategyName(transaction.strategyId)}</TableCell>
                <TableCell className="text-right">
                  {transaction.quantity}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(transaction.price)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(transaction.totalValue)}
                </TableCell>
                <TableCell className="text-right">
                  {transaction.fee ? formatCurrency(transaction.fee) : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {transaction.tags?.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TransactionDetailDialog
        transaction={selectedTransaction}
        open={!!selectedTransaction}
        onOpenChange={(open) => !open && setSelectedTransaction(null)}
      />
    </div>
  );
}
