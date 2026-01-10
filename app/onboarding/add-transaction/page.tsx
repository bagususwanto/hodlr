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
import { Textarea } from "@/components/ui/textarea";

// Schema aligned with @/components/transactions/transaction-form.tsx
const formSchema = z.object({
  type: z.enum(["BUY", "SELL", "SWAP"]), // Expanded types but we might validly only use BUY/SELL for first transaction
  qty: z.coerce.number().positive("Quantity must be positive"),
  price: z.coerce.number().positive("Price must be positive"),
  fee: z.coerce.number().min(0).optional(),
  date: z.date(),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

const TransactionForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const symbol = searchParams.get("symbol") || "Asset";
  const name = searchParams.get("name") || symbol;
  const category = searchParams.get("category") || "crypto";
  const exchange = searchParams.get("exchange") || "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      type: "BUY",
      qty: 0,
      price: 0,
      fee: 0,
      date: new Date(),
      notes: "",
      tags: "",
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
        exchange: exchange,
        createdAt: now,
        updatedAt: now,
      };

      const tagsArray = values.tags
        ? values.tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t)
        : undefined;

      const newTransaction: Transaction = {
        id: transactionId,
        assetId: assetId,
        type: values.type,
        quantity: values.qty,
        price: values.price,
        totalValue: values.qty * values.price,
        fee: values.fee,
        date: values.date,
        notes: values.notes,
        tags: tagsArray,
        createdAt: now,
        updatedAt: now,
      };

      // Perform transaction to ensure both are saved or neither
      await db.transaction("rw", db.assets, db.transactions, async () => {
        await db.assets.add(newAsset);
        await db.transactions.add(newTransaction);
      });

      toast.success("Portfolio setup complete!");
      router.push("/");
    } catch (error) {
      console.error("Failed to save data:", error);
      toast.error("Failed to setup portfolio. Please try again.");
    }
  }

  async function handleSkip() {
    try {
      const assetId = uuidv4();
      const now = new Date();

      const newAsset: Asset = {
        id: assetId,
        symbol: symbol,
        name: name,
        category: category,
        exchange: exchange,
        createdAt: now,
        updatedAt: now,
      };

      await db.assets.add(newAsset);
      toast.success("Asset added successfully!");
      router.push("/");
    } catch (error) {
      console.error("Failed to save asset:", error);
      toast.error("Failed to skip. Please try again.");
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <SelectItem value="BUY">Buy</SelectItem>
                      <SelectItem value="SELL">Sell</SelectItem>
                      <SelectItem value="SWAP">Swap</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="qty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="0.5"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>Amount of units.</FormDescription>
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
                      <Input
                        type="number"
                        step="any"
                        placeholder="50000"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>Price in USD.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fee</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="0"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>Transaction fee.</FormDescription>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="dca, swing, high-risk"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes..."
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse gap-4 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:flex-1"
                onClick={handleSkip}>
                Skip
              </Button>
              <Button type="submit" className="w-full sm:flex-1">
                Finish <Check className="ml-2 h-4 w-4" />
              </Button>
            </div>
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
