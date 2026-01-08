import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { StrategyFormValues } from "../schema";

interface StrategyTypeSelectProps {
  form: UseFormReturn<StrategyFormValues>;
}

export function StrategyTypeSelect({ form }: StrategyTypeSelectProps) {
  return (
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
  );
}
