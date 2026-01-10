"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Transaction } from "@/lib/db/schema";
import { ArrowUpRight, ArrowDownLeft, RefreshCcw } from "lucide-react";
import { useCurrency, useDateFormatter } from "@/hooks/use-formatters";

interface RecentTransactionsProps {
  transactions: (Transaction & { assetSymbol: string })[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const { formatCurrency } = useCurrency();
  const { formatDate } = useDateFormatter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <div key={tx.id} className="flex items-center">
                <div
                  className={`mr-4 flex h-9 w-9 items-center justify-center rounded-full border ${
                    tx.type === "BUY"
                      ? "bg-green-100 text-green-500 dark:bg-green-900/20"
                      : tx.type === "SELL"
                      ? "bg-red-100 text-red-500 dark:bg-red-900/20"
                      : "bg-blue-100 text-blue-500 dark:bg-blue-900/20"
                  }`}>
                  {tx.type === "BUY" && <ArrowDownLeft className="h-5 w-5" />}
                  {tx.type === "SELL" && <ArrowUpRight className="h-5 w-5" />}
                  {tx.type === "SWAP" && <RefreshCcw className="h-4 w-4" />}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {tx.type} {tx.assetSymbol}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(tx.date)}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  {tx.type === "BUY" ? "+" : "-"}
                  {tx.quantity} {tx.assetSymbol}
                  <div className="text-xs text-muted-foreground text-right">
                    {formatCurrency(tx.totalValue)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              No recent transactions
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
