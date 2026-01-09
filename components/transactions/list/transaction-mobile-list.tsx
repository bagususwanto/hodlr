import { Transaction } from "@/lib/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Strategy } from "@/lib/db/schema";

interface TransactionMobileListProps {
  transactions: Transaction[];
  strategies: Strategy[];
  onRowClick: (transaction: Transaction) => void;
}

export function TransactionMobileList({
  transactions,
  strategies,
  onRowClick,
}: TransactionMobileListProps) {
  const getStrategyName = (strategyId?: string) => {
    if (!strategyId) return "-";
    const strategy = strategies?.find((s) => s.id === strategyId);
    return strategy ? strategy.name : "Unknown Strategy";
  };

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card
          key={transaction.id}
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => onRowClick(transaction)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex flex-col">
              <span className="font-bold">
                {format(new Date(transaction.date), "MMM d, yyyy")}
              </span>
              <span className="text-xs text-muted-foreground pt-1">
                {getStrategyName(transaction.strategyId)}
              </span>
            </div>
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
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm mt-3">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Quantity</span>
                <span className="font-medium">{transaction.quantity}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-muted-foreground text-xs">
                  Total Value
                </span>
                <span className="font-medium">
                  {formatCurrency(transaction.totalValue)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Price</span>
                <span className="font-medium">
                  {formatCurrency(transaction.price)}
                </span>
              </div>
              {transaction.fee && (
                <div className="flex flex-col text-right">
                  <span className="text-muted-foreground text-xs">Fee</span>
                  <span className="font-medium">
                    {formatCurrency(transaction.fee)}
                  </span>
                </div>
              )}
            </div>
            {transaction.tags && transaction.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1">
                {transaction.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
