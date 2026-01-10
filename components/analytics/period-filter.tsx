import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Period } from "@/hooks/use-analytics";

interface PeriodFilterProps {
  value: Period;
  onChange: (value: Period) => void;
}

const periods: Period[] = ["7D", "30D", "90D", "1Y", "ALL"];

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as Period)}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Select period" />
      </SelectTrigger>
      <SelectContent>
        {periods.map((period) => (
          <SelectItem key={period} value={period}>
            {period}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
