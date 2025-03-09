"use client";

import { useNavbar } from "@/hooks/use-navbar";
import { usePathname, useSearchParams } from "next/navigation";
import { NavbarItem } from "./nav-item";
import { useRouter } from "next/navigation";
import { AddTab } from "./add-tab";

export default function Navbar() {
  const navbar = useNavbar();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  let currPath = pathname;
  if (searchParams.has("tab")) {
    currPath = pathname + "?tab=" + searchParams.get("tab");
  }

  return (
    <div className="w-full flex flex-col justify-end bg-neutral-700 rounded-t-md h-[2.7rem] max-w-5xl">
      <div className="flex justify-start ml-2">
        {navbar.routes.map((route, index) => (
          <NavbarItem
            key={index}
            label={route.label}
            path={route.path}
            icon={route.icon}
            navbar={navbar}
            router={router}
            isActive={route.path === currPath}
          />
        ))}
        <AddTab />
      </div>
    </div>
  );
}
