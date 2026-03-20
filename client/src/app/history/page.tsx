"use client";

import { Layout } from "@/components/Layout";
import { History, FileText, Clock, RotateCcw, Eye } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HistoryPage() {
  // In production, this would fetch from a Versions API
  const versions: any[] = [];

  return (
    <Layout>
      <div className="mb-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 mb-6">
          <div className="h-[2px] w-12 bg-accent" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Time Machine</span>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-primary leading-tight uppercase">Version History</h1>
        <p className="text-slate-500 text-lg font-medium mt-4 max-w-2xl">
          Every change you make is tracked. Browse previous versions, compare changes, and restore any snapshot with one click.
        </p>
      </div>

      {/* Feature Info */}
      <div className="glass rounded-3xl p-8 mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-accent/10">
            <History className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="font-black text-lg">How It Works</h3>
            <p className="text-sm text-slate-400 font-medium">Versions are created automatically when you save or use AI tools.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Clock, title: "Auto-Snapshots", desc: "Every save creates a version you can restore later." },
            { icon: Eye, title: "Side-by-Side Diff", desc: "Compare any two versions to see exactly what changed." },
            { icon: RotateCcw, title: "One-Click Restore", desc: "Roll back to any previous state instantly." },
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <feature.icon className="w-5 h-5 text-accent mb-3" />
              <h4 className="font-black text-sm mb-1">{feature.title}</h4>
              <p className="text-[11px] text-slate-400 font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {versions.length === 0 && (
        <div className="text-center py-24">
          <History className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-primary mb-3">No Versions Yet</h3>
          <p className="text-slate-400 font-medium mb-8 max-w-md mx-auto">
            Start editing a resume and versions will appear here automatically. Each save creates a snapshot you can restore.
          </p>
          <Link href="/resumes" className="btn-primary inline-flex items-center gap-3">
            <FileText className="w-5 h-5" /> Go to My Resumes
          </Link>
        </div>
      )}
    </Layout>
  );
}
