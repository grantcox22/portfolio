import {
  Grid2X2,
  Home,
  List,
  LucideIcon,
  SquareTerminal,
  UserCog,
} from "lucide-react";
import { create } from "zustand";

export type NavRoute = {
  label: string;
  path: string;
  icon: LucideIcon;
};

type NavbarState = {
  routes: { label: string; path: string; icon: LucideIcon }[];
  addRoute: (label: string, path: string, icon: LucideIcon) => void;
  removeRoute: (path: string) => void;
};

export const useNavbar = create<NavbarState>((set) => ({
  routes: [
    { label: "Projects", path: "/projects", icon: List },
    { label: "Console", path: "/console", icon: SquareTerminal },
  ],
  addRoute: (label, path, icon) =>
    set((state) => ({ routes: [...state.routes, { label, path, icon }] })),
  removeRoute: (path) =>
    set((state) => ({
      routes: state.routes.filter((route) => route.path !== path),
    })),
}));
