"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { MoveRight } from "lucide-react";

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

const formSchema = z.object({
  symbol: z
    .string()
    .min(2, {
      message: "Symbol must be at least 2 characters.",
    })
    .toUpperCase(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
});

export default function AddAssetPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      name: "",
      category: "crypto",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Pass asset details via query params to the next step
    // We do NOT save here to prevent RouteGuard from redirecting early
    const params = new URLSearchParams({
      symbol: values.symbol,
      name: values.name,
      category: values.category,
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
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symbol</FormLabel>
                  <FormControl>
                    <Input placeholder="BTC" {...field} />
                  </FormControl>
                  <FormDescription>
                    The ticker symbol of the asset (e.g., BTC, AAPL).
                  </FormDescription>
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
                  <FormDescription>The full name of the asset.</FormDescription>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="crypto">Crypto</SelectItem>
                      <SelectItem value="stock">Stock</SelectItem>
                      <SelectItem value="forex">Forex</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Continue <MoveRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
