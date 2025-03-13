"use client";

import { NavbarItem } from "@/components/nav-item";
import { useNavbar } from "@/hooks/use-navbar";
import {
  ArrowLeft,
  Divide,
  Grid2X2,
  Home,
  List,
  Settings2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const navbarRoutes = [
  { label: "Dashboard", path: "/admin", icon: Settings2 },
  {
    label: "Projects",
    path: "/admin/projects",
    icon: List,
  },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const navbar = useNavbar();

  return (
    <div className="w-full flex flex-col justify-end bg-neutral-700 rounded-t-md h-[2.7rem] max-w-5xl">
      <div className="flex justify-start ml-2">
        <NavbarItem
          label="Home"
          path="/"
          icon={ArrowLeft}
          isActive={pathname === "/"}
          pinned
          navbar={navbar}
          router={router}
        />
        {navbarRoutes.map((route, index) => (
          <NavbarItem
            label={route.label}
            path={route.path}
            icon={route.icon}
            isActive={pathname === route.path}
            navbar={navbar}
            router={router}
            noX
          />
        ))}
      </div>
    </div>
  );
}
