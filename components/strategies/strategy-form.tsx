"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Strategy } from "@/lib/db/schema";
import { useCreateStrategy, useUpdateStrategy } from "@/hooks/use-strategies";
import { toast } from "sonner";
import { strategyFormSchema, StrategyFormValues } from "./schema";
import { prepareStrategyPayload } from "./utils";
import { StrategyTypeSelect } from "./forms/strategy-type-select";
import { StrategyBasicInfo } from "./forms/strategy-basic-info";
import { DcaConfigForm } from "./forms/dca-config-form";
import { SwingConfigForm } from "./forms/swing-config-form";

interface StrategyFormProps {
  strategy?: Strategy;
  onSuccess: () => void;
}

export function StrategyForm({ strategy, onSuccess }: StrategyFormProps) {
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
      const payload = prepareStrategyPayload(data);

      const strategyData = {
        ...payload,
        status: strategy?.status || "ACTIVE",
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
        <StrategyTypeSelect form={form} />
        <StrategyBasicInfo form={form} />

        {watchedType === "DCA" && <DcaConfigForm form={form} />}
        {watchedType === "SWING" && <SwingConfigForm form={form} />}

        <Button className="w-full" type="submit">
          Save Strategy
        </Button>
      </form>
    </Form>
  );
}
