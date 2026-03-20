"use client";

import { Layout } from "@/components/Layout";
import {
  Plus,
  FileText,
  Clock,
  ChevronRight,
  MoreVertical,
  Sparkles,
  Trash2,
  Copy,
  Target,
} from "lucide-react";
import { useState } from "react";
import { ResumeService } from "@/services/ResumeService";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "@/store/useUIStore";

interface Resume {
  _id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  basics: { fullName: string; email?: string };
  stats?: {
    readiness: number;
    atsScore: number;
    marketFit: number;
  };
}

export default function ResumesPage() {
  const queryClient = useQueryClient();
  const { openCreateModal } = useUIStore();

  const { data: resumes = [], isLoading: loading } = useQuery<Resume[]>({
    queryKey: ["resumes"],
    queryFn: async () => {
      console.log("📡 API FETCH: Resumes Vault (Triggered)");
      const response = await ResumeService.list();
      return response.data || [];
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    if (!confirm("Delete this resume permanently?")) return;
    try {
      await ResumeService.delete(id);
      queryClient.setQueryData(
        ["resumes"],
        (old: Resume[] | undefined) => old?.filter((r) => r._id !== id) || [],
      );
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    } catch (error) {
      console.error("Failed to delete resume", error);
    }
  };

  const handleDuplicate = async (id: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    try {
      await ResumeService.duplicate(id);
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    } catch (error) {
      console.error("Failed to duplicate resume", error);
    }
  };

  return (
    <Layout>
      <div className="mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="h-[2px] w-12 bg-accent" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
            Document Vault
          </span>
        </motion.div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-primary leading-tight uppercase">
            My Resumes
          </h1>
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 w-fit"
          >
            <Plus className="w-4 h-4" /> Create New
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-3xl bg-slate-100 animate-pulse"
              />
            ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-32 glass rounded-[40px] border-dashed border-2 border-slate-200">
          <FileText className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-primary mb-3">
            Vault is Empty
          </h3>
          <p className="text-slate-400 font-medium mb-8">
            Ready to deploy your first tactical AI resume?
          </p>
          <button
            onClick={openCreateModal}
            className="px-8 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 inline-flex items-center gap-3"
          >
            <Plus className="w-5 h-5" /> Forge New Document
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {resumes.map((resume, i) => (
              <motion.div
                key={resume._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-[32px] p-6 flex flex-col md:flex-row md:items-center gap-6 group hover:shadow-floating transition-all relative overflow-hidden"
              >
                <div className="p-4 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform shrink-0 w-fit">
                  <FileText className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-black tracking-tight group-hover:text-accent transition-colors truncate">
                      {resume.title}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-50 text-[8px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">
                      Draft
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {resume.basics?.fullName || "Untitled"}
                    </span>
                    <span className="text-slate-200 hidden md:block">•</span>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent">
                      <Sparkles className="w-3 h-3" />
                      {resume.stats?.readiness || 85}% Ready
                    </div>
                    <span className="text-slate-200 hidden md:block">•</span>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary/60">
                      <Target className="w-3 h-3" />
                      ATS: {resume.stats?.atsScore || 0}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                  <div className="text-right mr-4 hidden lg:block">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-300 mb-0.5">
                      Last Deployment
                    </p>
                    <p className="text-[10px] font-bold text-slate-400">
                      {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDuplicate(resume._id, e)}
                    className="p-2.5 hover:bg-slate-100 rounded-xl transition-all"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4 text-slate-400" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(resume._id, e)}
                    className="p-2.5 hover:bg-red-50 rounded-xl transition-all group/del"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400 group-hover/del:text-red-500" />
                  </button>
                  <Link
                    href={`/resume/${resume._id}`}
                    className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-accent hover:shadow-lg hover:shadow-accent/30 transition-all font-black"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </Layout>
  );
}
