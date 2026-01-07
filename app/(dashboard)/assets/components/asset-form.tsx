"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { useCreateAsset, useUpdateAsset } from "@/hooks/use-assets";
import { Asset } from "@/lib/db/schema";
import { toast } from "sonner";
import { useEffect } from "react";

const assetSchema = z.object({
  symbol: z.string().min(1, "Symbol is required").toUpperCase(),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  exchange: z.string().optional(),
});

type AssetFormValues = z.infer<typeof assetSchema>;

interface AssetFormProps {
  asset?: Asset;
  onSuccess?: () => void;
}

export function AssetForm({ asset, onSuccess }: AssetFormProps) {
  const { createAsset } = useCreateAsset();
  const { updateAsset } = useUpdateAsset();

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      symbol: "",
      name: "",
      category: "crypto",
      exchange: "",
    },
  });

  useEffect(() => {
    if (asset) {
      form.reset({
        symbol: asset.symbol,
        name: asset.name,
        category: asset.category,
        exchange: asset.exchange || "",
      });
    }
  }, [asset, form]);

  const onSubmit = async (data: AssetFormValues) => {
    try {
      if (asset) {
        await updateAsset(asset.id, data);
        toast.success("Asset updated successfully");
      } else {
        await createAsset(data);
        toast.success("Asset created successfully");
      }
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to save asset");
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symbol</FormLabel>
              <FormControl>
                <Input placeholder="BTC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Bitcoin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="crypto">Crypto</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="forex">Forex</SelectItem>
                  <SelectItem value="commodity">Commodity</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="exchange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exchange (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Binance" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {asset ? "Update Asset" : "Add Asset"}
        </Button>
      </form>
    </Form>
  );
}
