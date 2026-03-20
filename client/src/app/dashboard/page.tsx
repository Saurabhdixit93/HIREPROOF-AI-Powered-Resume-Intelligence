"use client";

import { Layout } from "@/components/Layout";
import {
  Plus,
  FileText,
  Clock,
  MoreVertical,
  Sparkles,
  ChevronRight,
  Trash2,
  Copy,
  Edit3,
  Target,
  Zap,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { useState, useMemo } from "react";
import { ResumeService } from "@/services/ResumeService";
import { AuthService } from "@/services/AuthService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useUIStore } from "@/store/useUIStore";
import { motion, AnimatePresence } from "framer-motion";

interface Resume {
  _id: string;
  title: string;
  updatedAt: string;
  basics: {
    fullName: string;
  };
  stats?: {
    readiness: number;
    atsScore: number;
    marketFit: number;
  };
}

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const { openCreateModal } = useUIStore();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Core Data: Resumes
  const { data: resumes = [], isLoading: loading } = useQuery<Resume[]>({
    queryKey: ["resumes"],
    queryFn: async () => {
      console.log("📡 API FETCH: Resumes List (Triggered)");
      const response = await ResumeService.list();
      return response.data || [];
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Core Data: User Stats (Professional End-to-End)
  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await AuthService.getMe();
      return response.data;
    },
    staleTime: 60000, // Frequent enough for tokens but still cached
  });

  // Dynamic Intelligence Calculations
  const intelligence = useMemo(() => {
    if (resumes.length === 0)
      return { impact: 0, ats: 0, fit: "N/A", tokens: "0" };

    const totals = resumes.reduce(
      (acc, r) => ({
        impact: acc.impact + (r.stats?.readiness || 0),
        ats: acc.ats + (r.stats?.atsScore || 0),
        fit: acc.fit + (r.stats?.marketFit || 0),
      }),
      { impact: 0, ats: 0, fit: 0 },
    );

    const avgFit = totals.fit / resumes.length;

    return {
      impact: Math.round(totals.impact / resumes.length) || 0,
      ats: Math.round(totals.ats / resumes.length) || 0,
      fit: avgFit > 80 ? "S-Tier" : avgFit > 60 ? "High" : "Optimal",
      tokens: `${((userProfile?.totalTokensUsed || 0) / 1000).toFixed(1)}k`,
    };
  }, [resumes, userProfile]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this resume permanently?")) return;
    try {
      await ResumeService.delete(id);
      queryClient.setQueryData(
        ["resumes"],
        (old: Resume[] | undefined) => old?.filter((r) => r._id !== id) || [],
      );
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      setActiveMenu(null);
    } catch (error) {
      console.error("Failed to delete resume", error);
    }
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await ResumeService.duplicate(id);
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      setActiveMenu(null);
    } catch (error) {
      console.error("Failed to duplicate resume", error);
    }
  };

  return (
    <Layout>
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="mb-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="h-[2px] w-12 bg-accent"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
                Tactical Intelligence Overview
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-primary leading-tight uppercase">
              COMMAND <br className="md:hidden" /> CENTER
            </h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-4"
        >
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3 border border-accent/20">
            <div className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
            <span className="text-sm font-black uppercase tracking-widest text-primary">
              Live Optimization Active
            </span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Forge New Card */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreateModal}
          className="h-[320px] rounded-[40px] border-2 border-dashed border-slate-200 hover:border-accent hover:bg-accent/5 transition-all flex flex-col items-center justify-center gap-6 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-6 rounded-3xl bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-500">
            <Plus className="w-8 h-8 text-primary group-hover:rotate-90 transition-transform duration-500" />
          </div>
          <div className="text-center">
            <p className="font-black uppercase tracking-widest text-sm mb-1 text-primary">
              Forge New
            </p>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Initialization sequence
            </p>
          </div>
        </motion.button>

        {loading ? (
          Array(2)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-[320px] rounded-[40px] bg-slate-100 animate-pulse"
              />
            ))
        ) : (
          <AnimatePresence mode="popLayout">
            {resumes.map((resume, i) => (
              <motion.div
                key={resume._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-[40px] p-8 flex flex-col group relative h-[320px] hover:shadow-floating transition-all border border-white/50"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-8 relative">
                  <div className="p-4 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex gap-2 relative">
                    <span className="px-3 py-1 rounded-full bg-slate-100/80 text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-center backdrop-blur-md border border-slate-200/50">
                      Draft
                    </span>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(
                            activeMenu === resume._id ? null : resume._id,
                          );
                        }}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors relative z-10"
                      >
                        <MoreVertical className="w-5 h-5 text-slate-400" />
                      </button>

                      {/* Dropdown Menu - Outside Close Overlay */}
                      {activeMenu === resume._id && (
                        <>
                          <div
                            className="fixed inset-0 z-[100]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenu(null);
                            }}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.2)] border border-slate-100 p-2.5 z-[110] backdrop-blur-2xl"
                          >
                            <Link
                              href={`/resume/${resume._id}`}
                              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 rounded-2xl transition-all text-sm font-black text-primary group/item uppercase tracking-tighter"
                            >
                              <Edit3 className="w-4 h-4 text-slate-400 group-hover/item:text-primary group-hover/item:scale-110 transition-all font-black" />
                              Edit Content
                            </Link>
                            <button
                              onClick={(e) => handleDuplicate(resume._id, e)}
                              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 rounded-2xl transition-all text-sm font-black text-primary group/item text-left uppercase tracking-tighter"
                            >
                              <Copy className="w-4 h-4 text-slate-400 group-hover/item:text-primary group-hover/item:scale-110 transition-all font-black" />
                              Duplicate
                            </button>
                            <div className="h-[1px] bg-slate-50 my-1.5 mx-2" />
                            <button
                              onClick={(e) => handleDelete(resume._id, e)}
                              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 rounded-2xl transition-all text-sm font-black text-red-500 group/item text-left uppercase tracking-tighter"
                            >
                              <Trash2 className="w-4 h-4 text-red-300 group-hover/item:text-red-500 group-hover/item:scale-110 transition-all" />
                              Delete Permanent
                            </button>
                          </motion.div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="mb-auto">
                  <h3 className="text-2xl font-black mb-2 group-hover:text-accent transition-colors leading-tight tracking-tight">
                    {resume.title.toUpperCase()}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      AI Readiness: {resume.stats?.readiness || 0}%
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100/50">
                  <div className="flex items-center gap-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </div>
                  <Link
                    href={`/resume/${resume._id}`}
                    className="w-12 h-12 bg-primary text-white rounded-[18px] flex items-center justify-center hover:bg-accent hover:shadow-[0_10px_25px_rgba(6,182,212,0.4)] transition-all group/btn active:scale-90"
                  >
                    <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Quick Insights - Dynamic Tactical Intelligence */}
      <div className="mt-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-[1px] flex-1 bg-slate-100" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
            Tactical Intelligence Layer
          </h2>
          <div className="h-[1px] flex-1 bg-slate-100" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              label: "Profile Impact",
              val: `+${intelligence.impact}%`,
              trend: "up",
              icon: Zap,
            },
            {
              label: "ATS Pass Rate",
              val: `${intelligence.ats}/100`,
              trend: "stable",
              icon: Target,
            },
            {
              label: "Market Resonance",
              val: intelligence.fit,
              trend: "up",
              icon: TrendingUp,
            },
            {
              label: "Total Tokens",
              val: intelligence.tokens,
              trend: "low",
              icon: Cpu,
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm hover:shadow-floating transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <stat.icon className="w-16 h-16" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                {stat.label}
              </p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-black text-primary group-hover:text-accent transition-colors">
                  {stat.val}
                </span>
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                  <stat.icon className="w-5 h-5 text-accent" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* System Footer */}
      <footer className="mt-32 pb-12 border-t border-slate-100 pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <span className="text-[10px] font-black text-white">R</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Tactical Intelligence Engine © 2026
          </p>
        </div>

        <div className="flex items-center gap-10">
          {[
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
            { label: "Security", href: "/security" },
            { label: "Status", href: "/status" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-300">
            All Systems Nominal
          </span>
        </div>
      </footer>
    </Layout>
  );
}
