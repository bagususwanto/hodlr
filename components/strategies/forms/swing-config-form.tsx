"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StrategyFormValues } from "../schema";

interface SwingConfigFormProps {
  form: UseFormReturn<StrategyFormValues>;
}

export function SwingConfigForm({ form }: SwingConfigFormProps) {
  return (
    <div className="space-y-4 border rounded-md p-4 bg-muted/50">
      <h4 className="font-medium">Swing Trading Config</h4>

      <div className="border-b pb-4 mb-4">
        <h5 className="text-sm font-semibold mb-2">Entry Zone</h5>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="config.entryZoneMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
                </FormControl>
                <FormDescription>Lowest price to start buying.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="config.entryZoneMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
                </FormControl>
                <FormDescription>
                  Highest price limit for entry.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="border-b pb-4 mb-4">
        <h5 className="text-sm font-semibold mb-2">Exit Target</h5>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="config.takeProfit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Take Profit</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
                </FormControl>
                <FormDescription>
                  Target price to sell for profit.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="config.stopLoss"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stop Loss</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
                </FormControl>
                <FormDescription>
                  Price to exit to limit losses.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="config.totalAllocation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Allocation</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="e.g. 2 ETH or 1000 USD"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Total amount allocated for this swing trade.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="config.entryPlan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entry Plan</FormLabel>
            <FormControl>
              <Textarea
                placeholder={"e.g. \n30% @ $3000\n30% @ $2800"}
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
