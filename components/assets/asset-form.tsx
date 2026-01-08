"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateAsset, useUpdateAsset } from "@/hooks/use-assets";
import { Asset } from "@/lib/db/schema";
import { toast } from "sonner";
import { useEffect } from "react";
import { assetSchema, AssetFormValues } from "./schema";
import { AssetFormFields } from "./form/asset-form-fields";

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
        <AssetFormFields form={form} />
        <Button type="submit" className="w-full">
          {asset ? "Update Asset" : "Add Asset"}
        </Button>
      </form>
    </Form>
  );
}
