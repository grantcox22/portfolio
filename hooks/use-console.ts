import { ConsoleLine } from "@/lib/console";
import { create } from "zustand";

type ConsoleState = {
  lines: ConsoleLine[];
  prompt?: {
    content: string;
    callback: (input: string) => void;
  };
  input?: boolean;
  currentUser?: string;
  setCurrentUser: (user: string) => void;
  enablePrompt: (content: string, callback: (input: string) => void) => void;
  disablePrompt: () => void;
  addLine: (l: { content: string; input?: boolean; path: string }) => void;
  clear: () => void;
};

export const useConsoleState = create<ConsoleState>((set) => ({
  lines: [],
  currentUser: undefined,
  input: false,
  setCurrentUser: (user) => set({ currentUser: user }),
  enablePrompt: (content, callback) => {
    set(() => ({
      prompt: {
        content,
        callback,
      },
      input: true,
    }));
  },
  disablePrompt: () => set({ input: false, prompt: undefined }),
  addLine: (l) =>
    set((state) => ({
      lines: [...state.lines, { ...l, user: state.currentUser }],
    })),
  clear: () => set({ lines: [] }),
}));
