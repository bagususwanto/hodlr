"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAssets } from "@/hooks/use-assets";
import { useStrategies } from "@/hooks/use-strategies";
import {
  useCreateTransaction,
  useUpdateTransaction,
} from "@/hooks/use-transactions";
import { toast } from "sonner";
import { Transaction } from "@/lib/db/schema";
import { useState } from "react";

const formSchema = z.object({
  type: z.enum(["BUY", "SELL", "SWAP"]),
  assetId: z.string().min(1, "Asset is required"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  price: z.coerce.number().positive("Price must be positive"),
  fee: z.coerce.number().min(0).optional(),
  date: z.date(),
  strategyId: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(), // Comma separated string for input
});

type TransactionFormValues = z.infer<typeof formSchema>;

export interface TransactionFormProps {
  onSuccess?: () => void;
  defaultAssetId?: string;
  transaction?: Transaction;
}

export function TransactionForm({
  onSuccess,
  defaultAssetId,
  transaction,
}: TransactionFormProps) {
  const { assets } = useAssets();
  const { strategies } = useStrategies();
  const { createTransaction } = useCreateTransaction();
  const { updateTransaction } = useUpdateTransaction();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      type: transaction?.type || "BUY",
      assetId: transaction?.assetId || defaultAssetId || "",
      quantity: transaction?.quantity || 0,
      price: transaction?.price || 0,
      fee: transaction?.fee || 0,
      date: transaction?.date ? new Date(transaction.date) : new Date(),
      strategyId: transaction?.strategyId || "none",
      notes: transaction?.notes || "",
      tags: transaction?.tags?.join(", ") || "",
    },
  });

  async function onSubmit(values: TransactionFormValues) {
    try {
      setIsSubmitting(true);
      const totalValue = values.quantity * values.price;
      const tagsArray = values.tags
        ? values.tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t)
        : undefined;

      const transactionData = {
        assetId: values.assetId,
        type: values.type,
        quantity: values.quantity,
        price: values.price,
        totalValue,
        fee: values.fee,
        date: values.date,
        strategyId:
          values.strategyId === "none" ? undefined : values.strategyId,
        notes: values.notes,
        tags: tagsArray,
      };

      if (transaction) {
        await updateTransaction(transaction.id, transactionData);
        toast.success("Transaction updated successfully");
      } else {
        await createTransaction(transactionData);
        toast.success("Transaction added successfully");
      }

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error(
        transaction
          ? "Failed to update transaction"
          : "Failed to add transaction"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control as any}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value as string}>
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

        <FormField
          control={form.control as any}
          name="assetId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value as string}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {assets?.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.name} ({asset.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control as any}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    {...field}
                    value={field.value as number}
                    onChange={(e) => field.onChange(e)}
                  />
                </FormControl>
                <FormDescription>
                  The amount of assets to buy/sell (e.g., 0.5 BTC).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Unit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    {...field}
                    value={field.value as number}
                    onChange={(e) => field.onChange(e)}
                  />
                </FormControl>
                <FormDescription>
                  Price per single unit in USD (e.g., $50,000).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control as any}
            name="fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fee</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    {...field}
                    value={(field.value as number) ?? ""}
                    onChange={(e) => field.onChange(e)}
                  />
                </FormControl>
                <FormDescription>Total transaction fee in USD.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
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
                          format(field.value as Date, "PPP")
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
                      selected={field.value as Date}
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
          control={form.control as any}
          name="strategyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Strategy (Optional)</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value as string}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {strategies?.map((strategy) => (
                    <SelectItem key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as any}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma separated)</FormLabel>
              <FormControl>
                <Input
                  placeholder="dca, swing, high-risk"
                  {...field}
                  value={(field.value as string) ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as any}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes about this transaction"
                  className="resize-none"
                  {...field}
                  value={(field.value as string) ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? transaction
              ? "Saving..."
              : "Adding Transaction..."
            : transaction
            ? "Save Changes"
            : "Add Transaction"}
        </Button>
      </form>
    </Form>
  );
}
