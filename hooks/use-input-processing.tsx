import { create } from "zustand";

type InputProcessingState = {
  processing: boolean;
  toggleProcessing: () => void;
  setProcessing: (processing: boolean) => void;
};

export const useInputProcessing = create<InputProcessingState>((set) => ({
  processing: false,
  toggleProcessing: () => set((state) => ({ processing: !state.processing })),
  setProcessing: (processing) => set({ processing }),
}));
