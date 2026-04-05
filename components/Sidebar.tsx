"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Zap,
  CopyMinus,
  Sparkles,
  Send,
  FileText,
  LayoutTemplate,
  User,
  Settings,
  Activity,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Quick Send", href: "/quick-send", icon: Zap },
  { name: "Bulk Send", href: "/bulk-send", icon: CopyMinus },
  { name: "AI Job Finder", href: "/job-finder", icon: Sparkles },
  { name: "Applications", href: "/applications", icon: Send },
  { name: "Resumes", href: "/resumes", icon: FileText },
  { name: "Templates", href: "/templates", icon: LayoutTemplate },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Navigation */}
      <div className="md:hidden flex-none w-full flex items-center justify-between bg-[var(--color-sidebar)] border-b border-[var(--color-border)] p-4 relative z-50">
        <div className="flex items-center gap-2">
          <div className="bg-zinc-100 text-black p-1 rounded-md">
            <Activity size={18} strokeWidth={3} />
          </div>
          <h1 className="font-semibold text-lg">JobFinder</h1>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[var(--color-text-secondary)] hover:text-white transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay Background */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 h-full bg-[var(--color-sidebar)] border-r border-[var(--color-border)] 
        flex flex-col transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Desktop Logo Area (Hidden on Mobile) */}
        <div className="hidden md:flex p-6 items-center gap-3">
          <div className="bg-zinc-100 text-black p-1.5 rounded-md">
            <Activity size={20} strokeWidth={3} />
          </div>
          <div>
            <h1 className="font-semibold text-lg leading-tight">JobFinder</h1>
            <p className="text-[10px] text-[var(--color-text-secondary)]">
              Fast Job Applications
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1 mt-4 md:mt-0 overflow-y-auto pb-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)} // Close sidebar on mobile when a link is clicked
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-zinc-100 text-black font-medium"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-card)] hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 text-xs text-[var(--color-text-secondary)] mt-auto border-t border-[var(--color-border)] md:border-none">
          © 2026 JobFinder
        </div>
      </aside>
    </>
  );
}
