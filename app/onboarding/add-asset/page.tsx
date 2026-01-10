"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { MoveRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { assetSchema, AssetFormValues } from "@/components/assets/schema";
import { AssetFormFields } from "@/components/assets/form/asset-form-fields";

export default function AddAssetPage() {
  const router = useRouter();
  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      symbol: "",
      name: "",
      category: "crypto",
      exchange: "",
    },
  });

  function onSubmit(values: AssetFormValues) {
    // Pass asset details via query params to the next step
    // We do NOT save here to prevent RouteGuard from redirecting early
    const params = new URLSearchParams({
      symbol: values.symbol,
      name: values.name,
      category: values.category,
      exchange: values.exchange || "",
    });
    router.push(`/onboarding/add-transaction?${params.toString()}`);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add Your First Asset</CardTitle>
        <CardDescription>
          Let's start by adding an asset you own.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AssetFormFields form={form} />
            <Button type="submit" className="w-full">
              Continue <MoveRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
