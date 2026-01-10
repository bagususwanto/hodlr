import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PreferencesState {
  currency: "USD" | "IDR" | "EUR" | "GBP" | "JPY";
  dateFormat: string;
  setCurrency: (currency: PreferencesState["currency"]) => void;
  setDateFormat: (dateFormat: string) => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      currency: "USD",
      dateFormat: "dd/MM/yyyy",
      setCurrency: (currency) => set({ currency }),
      setDateFormat: (dateFormat) => set({ dateFormat }),
    }),
    {
      name: "hodlr-preferences",
    }
  )
);
