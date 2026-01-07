import { create } from "zustand";

interface AppState {
  isLoading: boolean;
  activeStrategyId: string | null;
  setLoading: (loading: boolean) => void;
  setActiveStrategyId: (id: string | null) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  isLoading: false,
  activeStrategyId: null,
  setLoading: (loading) => set({ isLoading: loading }),
  setActiveStrategyId: (id) => set({ activeStrategyId: id }),
}));
