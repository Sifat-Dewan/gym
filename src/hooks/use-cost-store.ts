import { create } from "zustand";

type CostStore = {
  cost: number | undefined;
  setCost: (value: number | undefined) => void;
};

export const useCostStore = create<CostStore>((set) => ({
  cost: undefined,
  setCost: (value: number | undefined) => set({ cost: value }),
}));
