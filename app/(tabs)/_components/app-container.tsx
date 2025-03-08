"use client";

import Navbar from "@/components/navbar";

export default function AppContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen py-20 px-6 bg-neutral-900">
      <div className="flex-col w-full max-w-5xl min-h-[50vh] h-full border border-gray-500/70 rounded-md bg-gray-950">
        <Navbar />
        <div className="flex-grow h-full">{children}</div>
      </div>
    </div>
  );
}
