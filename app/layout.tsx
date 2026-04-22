import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Job Finder | Smart Job Search & Recruiter Email Extractor",
  description:
    "Use AI to find job openings online and automatically extract recruiter email addresses. Apply faster and smarter.",
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
