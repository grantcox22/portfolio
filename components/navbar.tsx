"use client";

import { useNavbar } from "@/hooks/use-navbar";
import { usePathname, useSearchParams } from "next/navigation";
import { NavbarItem } from "./nav-item";
import { useRouter } from "next/navigation";
import { AddTab } from "./add-tab";
import { Home, Settings2, UserCog2Icon } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const navbar = useNavbar();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  let currPath = pathname;
  if (searchParams.has("tab")) {
    currPath = pathname + "?tab=" + searchParams.get("tab");
  }

  return (
    <div className="w-full flex flex-col justify-end bg-neutral-700 rounded-t-md h-[2.7rem] max-w-5xl">
      <div className="flex justify-start ml-2">
        {session?.user?.username === "grantcox" && (
          <NavbarItem
            label="Admin"
            path="/admin"
            icon={Settings2}
            navbar={navbar}
            router={router}
            isActive={pathname === "/admin"}
            pinned
          />
        )}
        <NavbarItem
          label="Home"
          path="/"
          icon={Home}
          navbar={navbar}
          router={router}
          isActive={pathname === "/"}
          pinned
        />
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
