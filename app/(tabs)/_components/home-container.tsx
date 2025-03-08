"use client";

import { Linkedin, Github } from "lucide-react";
import Link from "next/link";

export default function Home({}) {
  return (
    <div className="p-4 pt-6 text-clip space-y-2">
      <h1 className="text-3xl font-bold">Welcome to GCox.Dev</h1>
      <p>My name is Grant Cox, and I am a Computer Engineer.</p>
      <div className="flex items-center space-x-2">
        <Link href="https://www.linkedin.com/in/grantcox22/">
          <Linkedin />
        </Link>
        <Link href="">
          <Github />
        </Link>
      </div>
    </div>
  );
}
