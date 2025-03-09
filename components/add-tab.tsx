import { NavRoute, useNavbar } from "@/hooks/use-navbar";
import {
  ChevronDown,
  Home,
  Icon,
  Plus,
  Square,
  SquareTerminal,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { set } from "zod";

const availableTabs: NavRoute[] = [
  {
    path: "/",
    icon: Home,
    label: "New Tab",
  },
  {
    path: "/console",
    icon: SquareTerminal,
    label: "New Console",
  },
];

const getPath = (path: string, currRoutes: NavRoute[]) => {
  let n = 0;
  let newPath = path;
  while (currRoutes.find((r: NavRoute) => r.path === newPath)) {
    n++;
    newPath = `${path}?tab=${n}`;
  }
  return newPath;
};

export function AddTab() {
  const navbar = useNavbar();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <div className="flex mx-2 items-center space-x-2 relative">
      <div className="h-4 w-[0.5px] bg-neutral-500" />
      <Link href={getPath("/console", navbar.routes)}>
        <Plus
          className="w-6 h-6 p-1 cursor-pointer rounded-[8px] hover:bg-neutral-600"
          onClick={() => {
            setDropdownOpen(false);
            navbar.addRoute(
              "New Console",
              getPath("/console", navbar.routes),
              SquareTerminal
            );
          }}
        />
      </Link>
      <div className="h-4 w-[0.5px] bg-neutral-500" />
      <ChevronDown
        className="w-6 h-6 p-1 cursor-pointer rounded-[8px] hover:bg-neutral-600"
        onClick={() => {
          setDropdownOpen(!dropdownOpen);
        }}
      />
      {dropdownOpen && (
        <div className="absolute top-[34px] left-[6px] bg-neutral-700 rounded-md p-2 w-48 text-sm space-y-1 z-50">
          {availableTabs.map((tab, index) => (
            <Link
              href={getPath(tab.path, navbar.routes)}
              onClick={() => {
                setDropdownOpen(false);
                navbar.addRoute(
                  tab.label,
                  getPath(tab.path, navbar.routes),
                  tab.icon
                );
              }}
              className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-neutral-600"
              key={index}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
