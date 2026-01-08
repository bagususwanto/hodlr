import * as z from "zod";

export const assetSchema = z.object({
  symbol: z.string().min(1, "Symbol is required").toUpperCase(),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  exchange: z.string().optional(),
});

export type AssetFormValues = z.infer<typeof assetSchema>;
