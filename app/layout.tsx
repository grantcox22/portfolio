import type { GetServerSidePropsContext, Metadata } from "next";
import "./globals.css";
import SessionWrapper from "@/components/providers/session-wrapper";
import Script from "next/script";
import { getSession } from "next-auth/react";

export const metadata: Metadata = {
  title: "GCox Dev",
  description: "This is my page",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
function serverSideTranslations(locale: any, arg1: string[]) {
  throw new Error("Function not implemented.");
}
