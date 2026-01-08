import * as z from "zod";

export const strategyFormSchema = z.object({
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

export type StrategyFormValues = z.infer<typeof strategyFormSchema>;
