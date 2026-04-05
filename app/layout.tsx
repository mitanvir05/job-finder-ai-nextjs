import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobFinder AI",
  description: "Fast Job Applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} flex flex-col md:flex-row h-screen overflow-hidden bg-[var(--color-app-bg)]`}
        suppressHydrationWarning
      >
        <Sidebar />
        <main className="flex-1 overflow-y-auto w-full">{children}</main>
      </body>
    </html>
  );
}
