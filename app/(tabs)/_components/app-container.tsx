"use client";

import Navbar from "@/components/navbar";
import { Version } from "@/components/version";

import { Linkedin, Github } from "lucide-react";
import Link from "next/link";

export default function AppContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen py-20 px-6 bg-neutral-900">
      <div className="flex-col w-full max-w-5xl h-[calc(100vh-160px)] border border-gray-500/70 rounded-md bg-gray-950">
        <Navbar />
        <div className="flex-grow h-full">{children}</div>
      </div>
      <div className="flex justify-between space-x-2 py-2 fixed left-[50vw] max-5xl:px-6 transform translate-x-[-50%] bottom-10 max-w-5xl w-full">
        <div className="flex items-center space-x-2">
          <Link href="https://www.linkedin.com/in/grantcox22/" target="_blank">
            <Linkedin className="w-6 h-6 p-0.5 border-[1.5px]" />
          </Link>
          <Link href="https://github.com/grantcox22" target="_blank">
            <Github className="w-6 h-6 p-0.5 rounded-[24px] border-[1.5px]" />
          </Link>
        </div>
        <Version />
      </div>
    </div>
  );
}
