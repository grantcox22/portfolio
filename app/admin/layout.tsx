import { getCurrentSession } from "@/actions/authActions";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import AdminNavbar from "./_components/admin-navbar";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session) redirect("/");

  const user = await db.user.findFirst({
    where: {
      id: session.user.id,
    },
  });
  if (!user || user?.perms !== "ADMIN") redirect("/");

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen py-20 px-6 bg-neutral-900">
      <div className="flex-col w-full max-w-5xl h-[calc(100vh-160px)] border border-gray-500/70 rounded-md bg-gray-950">
        <AdminNavbar />
        <div className="flex-grow h-full">{children}</div>
      </div>
    </div>
  );
}
