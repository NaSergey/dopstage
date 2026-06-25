import { create } from "zustand";

interface YapperState {
  handle: string;
  setHandle: (handle: string) => void;
}

export const useYapperStore = create<YapperState>((set) => ({
  handle: "",
  setHandle: (handle) => set({ handle }),
}));
