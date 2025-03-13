"use client";

import { CornerDownRight } from "lucide-react";
import { ListItem } from "../../../components/list-item";
import Link from "next/link";
import { Category, Project } from "@prisma/client";
import { ProjectDisplay } from "@/components/project";

export default function Admin() {
  return (
    <div className="pl-4 pr-1 py-1 text-clip space-y-8 relative bg-gradient-to-t h-full max-h-[calc(100vh-13.25rem)]">
      <div className="pr-3 py-3 overflow-auto">Test</div>
    </div>
  );
}
