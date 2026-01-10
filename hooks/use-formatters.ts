import { usePreferences } from "@/hooks/use-preferences";
import { format } from "date-fns";

const CURRENCY_LOCALES: Record<string, string> = {
  USD: "en-US",
  IDR: "id-ID",
  EUR: "de-DE",
  GBP: "en-GB",
  JPY: "ja-JP",
};

export function useCurrency() {
  const { currency } = usePreferences();

  const formatCurrency = (value: number) => {
    const locale = CURRENCY_LOCALES[currency] || "en-US";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: currency === "IDR" ? 0 : 2, // IDR usually doesn't use decimals
      maximumFractionDigits: currency === "IDR" ? 0 : 2,
    }).format(value);
  };

  return { formatCurrency, currency };
}

export function useDateFormatter() {
  const { dateFormat } = usePreferences();

  const formatDate = (date: Date | string | number) => {
    try {
      const dateObj = new Date(date);
      return format(dateObj, dateFormat);
    } catch (e) {
      return String(date);
    }
  };

  return { formatDate, dateFormat };
}
