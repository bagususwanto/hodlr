import { StrategyFormValues } from "./schema";

export function prepareStrategyPayload(data: StrategyFormValues) {
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

    if (min !== undefined && !isNaN(min) && max !== undefined && !isNaN(max)) {
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

  // Filter out NaNs if any bad conversions happened
  Object.keys(config).forEach((key) => {
    if (typeof config[key] === "number" && isNaN(config[key]))
      delete config[key];
  });

  return {
    name: data.name,
    type: data.type,
    assetId: data.assetId,
    startDate: data.startDate,
    endDate: data.endDate,
    config,
  };
}
