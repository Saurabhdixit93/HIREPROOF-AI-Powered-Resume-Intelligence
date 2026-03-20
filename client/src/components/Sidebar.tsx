"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Settings,
  History,
  HelpCircle,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "My Resumes", href: "/resumes" },
  { icon: Sparkles, label: "AI Tools", href: "/ai-tools" },
  { icon: FileText, label: "Cover Letter", href: "/cover-letter" },
  { icon: History, label: "Version History", href: "/history" },
];

const secondaryItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Support", href: "/support" },
];

import { useUIStore } from "@/store/useUIStore";

export function Sidebar() {
  const pathname = usePathname();
  const { openCreateModal } = useUIStore();

  return (
    <aside className="w-72 border-r border-slate-100 h-[calc(100vh-80px)] bg-white sticky top-20 flex flex-col p-6 overflow-y-auto">
      <button
        onClick={openCreateModal}
        className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white rounded-2xl mb-10 font-bold uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/10 group"
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        Forge New Resume
      </button>

      <div className="space-y-2 mb-10">
        <p className="px-4 text-[10px] uppercase font-black text-slate-400 tracking-[0.25em] mb-6">
          Operations Center
        </p>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative overflow-hidden",
              pathname === item.href
                ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10"
                : "text-slate-500 hover:bg-slate-50 hover:text-primary",
            )}
          >
            <item.icon
              className={cn(
                "w-5 h-5 transition-colors z-10",
                pathname === item.href
                  ? "text-accent"
                  : "group-hover:text-primary",
              )}
            />
            <span className="z-10 font-bold tracking-tight uppercase text-xs">
              {item.label}
            </span>
            {pathname === item.href && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-primary -z-0"
              />
            )}
          </Link>
        ))}
      </div>

      <div className="mt-auto space-y-2 border-t border-slate-50 pt-8">
        <p className="px-4 text-[10px] uppercase font-black text-slate-300 tracking-[0.25em] mb-4">
          Support & Config
        </p>
        {secondaryItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all text-slate-400 hover:bg-slate-50 hover:text-primary group",
            )}
          >
            <item.icon className="w-5 h-5 group-hover:text-primary transition-colors" />
            <span className="font-bold text-xs uppercase tracking-tight">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
