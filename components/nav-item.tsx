import { cn } from "@/lib/utils";
import { Icon, LucideIcon, X } from "lucide-react";
import Link from "next/link";

interface NavbarItemProps {
  label: string;
  path: string;
  icon: LucideIcon;
  isActive: boolean;
  navbar: any;
  router: any;
  pinned?: boolean;
  noX?: boolean;
}

export function NavbarItem({
  label,
  path,
  isActive,
  icon: Icon,
  navbar,
  pinned,
  noX,
}: NavbarItemProps) {
  let deleteRoute = "/";
  if (navbar.routes.length > 1) {
    let index = navbar.routes.findIndex((r: any) => r.path === path);
    if (index == 0) deleteRoute = navbar.routes[1].path;
    else deleteRoute = navbar.routes[index - 1]?.path;
  }

  return (
    <div
      draggable={true}
      className={cn(
        "flex items-center relative mx-0.5 h-8 w-full max-w-48 overflow-hidden",
        pinned && "max-w-10"
      )}
    >
      <div
        className={cn(
          "w-2 h-2 absolute left-[-8px] bottom-0 bg-none",
          isActive && "bg-gray-950"
        )}
      >
        <div
          className={cn(
            "w-full h-full rounded-br-[8px] bg-none",
            isActive && "bg-neutral-700"
          )}
        />
      </div>
      <div
        className={cn(
          "h-full w-full flex items-center rounded-t-lg text-sm justify-between z-50 overflow-hidden relative group",
          !isActive && "hover:bg-gray-950/80",
          isActive && "bg-gray-950 rounded-t-lg"
        )}
      >
        <Link
          href={path}
          className={cn(
            "ml-2 flex items-center flex-grow h-full text-clip text-nowrap",
            pinned && "px-1"
          )}
        >
          <Icon className={cn("w-3.5 h-3.5", !pinned && "mr-2")} />
          {!pinned && <span className="text-sm ">{label}</span>}
        </Link>
        {!pinned && !noX && (
          <Link
            className={cn(
              "flex items-center justify-center h-full px-1 absolute right-0 bg-neutral-700 parent-hover group-hover:bg-gray-950/0",
              isActive && "bg-gray-950"
            )}
            href={deleteRoute}
            onClick={(e) => {
              if (!isActive) e.preventDefault();
              navbar.removeRoute(path);
            }}
          >
            <X className="w-6 h-6 rounded-lg p-1 hover:bg-gray-800/80 cursor-pointer" />
          </Link>
        )}
      </div>
      <div
        className={cn(
          "w-2 h-2 absolute right-[-8px] bottom-0",
          isActive && "bg-gray-950"
        )}
      >
        <div
          className={cn(
            "w-full h-full rounded-bl-[8px] bg-none",
            isActive && "bg-neutral-700"
          )}
        />
      </div>
    </div>
  );
}
