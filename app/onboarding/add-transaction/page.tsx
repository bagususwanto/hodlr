"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon, Check } from "lucide-react";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { Asset, Transaction } from "@/lib/db/schema";
import { toast } from "sonner"; // Assuming sonner is installed

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const formSchema = z.object({
  type: z.enum(["buy", "sell"]),
  qty: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Quantity must be a positive number.",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Price must be a non-negative number.",
  }),
  date: z.date(),
});

const TransactionForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const symbol = searchParams.get("symbol") || "Asset";
  const name = searchParams.get("name") || symbol;
  const category = searchParams.get("category") || "crypto";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "buy",
      qty: "",
      price: "",
      date: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting transaction:", values);

    try {
      const assetId = uuidv4();
      const transactionId = uuidv4();
      const now = new Date();

      const newAsset: Asset = {
        id: assetId,
        symbol: symbol,
        name: name,
        category: category,
        createdAt: now,
        updatedAt: now,
      };

      const newTransaction: Transaction = {
        id: transactionId,
        assetId: assetId,
        type: values.type.toUpperCase() as "BUY" | "SELL",
        quantity: Number(values.qty),
        price: Number(values.price),
        totalValue: Number(values.qty) * Number(values.price),
        date: values.date,
        createdAt: now,
        updatedAt: now,
      };

      // Perform transaction to ensure both are saved or neither
      await db.transaction("rw", db.assets, db.transactions, async () => {
        await db.assets.add(newAsset);
        await db.transactions.add(newTransaction);
      });

      toast.success("Portfolio setup complete!");
      // Redirect using window.location to ensure RouteGuard sees the update immediately if needed,
      // though simple router push mostly works.
      // We'll stick to router.push but use window.location if we face issues with slow indexdb sync vs useLiveQuery
      router.push("/");
    } catch (error) {
      console.error("Failed to save data:", error);
      toast.error("Failed to setup portfolio. Please try again.");
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add First Transaction</CardTitle>
        <CardDescription>
          Record your first transaction for {symbol}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input placeholder="0.5" {...field} />
                  </FormControl>
                  <FormDescription>
                    The amount of units bought or sold.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="650000000" {...field} />
                  </FormControl>
                  <FormDescription>
                    The price per unit at the time of transaction.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}>
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The date when this transaction occurred.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Finish <Check className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default function AddTransactionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionForm />
    </Suspense>
  );
}
