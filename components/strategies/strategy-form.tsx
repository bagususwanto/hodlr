"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useAssets } from "@/hooks/use-assets";
import { Strategy } from "@/lib/db/schema";
import { useEffect } from "react";
import { useCreateStrategy, useUpdateStrategy } from "@/hooks/use-strategies";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const strategyFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum([
    "DCA",
    "LUMP_SUM",
    "VALUE_AVERAGING",
    "SWING",
    "HODL",
    "REBALANCING",
    "CUSTOM",
  ]),
  assetId: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  config: z
    .object({
      amount: z.string().optional(),
      frequency: z.enum(["daily", "weekly", "monthly"]).optional(),
      entryZoneMin: z.string().optional(),
      entryZoneMax: z.string().optional(),
      takeProfit: z.string().optional(),
      stopLoss: z.string().optional(),
      totalAllocation: z.string().optional(),
      entryPlan: z.string().optional(),
    })
    .optional(),
});

type StrategyFormValues = z.infer<typeof strategyFormSchema>;

interface StrategyFormProps {
  strategy?: Strategy;
  onSuccess: () => void;
}

export function StrategyForm({ strategy, onSuccess }: StrategyFormProps) {
  const { assets } = useAssets();
  const { createStrategy } = useCreateStrategy();
  const { updateStrategy } = useUpdateStrategy();

  const defaultValues: Partial<StrategyFormValues> = strategy
    ? {
        name: strategy.name,
        type: strategy.type,
        assetId: strategy.assetId,
        startDate: strategy.startDate,
        endDate: strategy.endDate,
        config: {
          amount: strategy.config.amount?.toString(),
          frequency: strategy.config.frequency,
          entryZoneMin: strategy.config.entryZone?.min?.toString(),
          entryZoneMax: strategy.config.entryZone?.max?.toString(),
          takeProfit: strategy.config.takeProfit?.toString(),
          stopLoss: strategy.config.stopLoss?.toString(),
          totalAllocation: strategy.config.totalAllocation?.toString(),
          entryPlan: strategy.config.entryPlan,
        },
      }
    : {
        name: "",
        type: "DCA",
        startDate: new Date(),
        config: {},
      };

  const form = useForm<StrategyFormValues>({
    resolver: zodResolver(strategyFormSchema),
    defaultValues,
  });

  const watchedType = form.watch("type");

  const onSubmit = async (data: StrategyFormValues) => {
    try {
      // Convert config strings to numbers/structure
      const config: any = {};

      if (data.config?.amount) {
        const val = Number(data.config.amount);
        if (!isNaN(val)) config.amount = val;
      }
      if (data.config?.frequency) config.frequency = data.config.frequency;

      if (data.type === "SWING") {
        const minStr = data.config?.entryZoneMin;
        const maxStr = data.config?.entryZoneMax;

        const min = minStr ? Number(minStr) : undefined;
        const max = maxStr ? Number(maxStr) : undefined;

        if (
          min !== undefined &&
          !isNaN(min) &&
          max !== undefined &&
          !isNaN(max)
        ) {
          config.entryZone = { min, max };
        }

        if (data.config?.takeProfit) {
          const val = Number(data.config.takeProfit);
          if (!isNaN(val)) config.takeProfit = val;
        }
        if (data.config?.stopLoss) {
          const val = Number(data.config.stopLoss);
          if (!isNaN(val)) config.stopLoss = val;
        }
        if (data.config?.totalAllocation) {
          const val = Number(data.config.totalAllocation);
          if (!isNaN(val)) config.totalAllocation = val;
        }
        if (data.config?.entryPlan) config.entryPlan = data.config.entryPlan;
      }

      // Filter out NaNs if any bad conversions happened (though input type=number prevents most)
      Object.keys(config).forEach((key) => {
        if (typeof config[key] === "number" && isNaN(config[key]))
          delete config[key];
      });

      const strategyData = {
        name: data.name,
        type: data.type,
        assetId: data.assetId,
        startDate: data.startDate,
        endDate: data.endDate,
        status: strategy?.status || "ACTIVE",
        config,
      };

      if (strategy) {
        await updateStrategy(strategy.id, strategyData);
        toast.success("Strategy updated");
      } else {
        await createStrategy(strategyData as any);
        toast.success("Strategy created");
      }
      onSuccess();
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Strategy Type</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["DCA", "SWING", "HODL", "CUSTOM"].map((type) => (
                    <div
                      key={type}
                      onClick={() => field.onChange(type)}
                      className={cn(
                        "cursor-pointer rounded-md border-2 p-4 text-center text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all",
                        field.value === type
                          ? "border-primary bg-accent/50"
                          : "border-muted bg-transparent"
                      )}>
                      {type}
                    </div>
                  ))}
                </div>
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
              <FormLabel>Strategy Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., DCA Bitcoin Monthly" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assetId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
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

        {watchedType === "DCA" && (
          <div className="space-y-4 border rounded-md p-4 bg-muted/50">
            <h4 className="font-medium">DCA Configuration</h4>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="config.amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount per Period</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="config.frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
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
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
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
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {watchedType === "SWING" && (
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
                      <FormDescription>
                        Lowest price to start buying.
                      </FormDescription>
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
                      placeholder="e.g. 
30% @ $3000
30% @ $2800"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <Button className="w-full" type="submit">
          Save Strategy
        </Button>
      </form>
    </Form>
  );
}
