"use client";

import { motion } from "framer-motion";
import { Scale, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-accent selection:text-white">
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/8 backdrop-blur-xl border-b border-slate-100 z-50 px-8 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-all">
            <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-primary" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">
            Tactical Dashboard
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Scale className="w-5 h-5 text-accent" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
            Engagement Terms v1.0
          </span>
        </div>
      </header>

      <main className="pt-40 pb-20 px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          <div>
            <span className="text-[10px] font-black text-accent uppercase tracking-[0.5em] mb-4 block">
              Usage Protocol
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase leading-none mb-8">
              Terms of <br /> Service
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
              By accessing the Intelligence Engine, you agree to operate within
              the defined ethical and operational boundaries.
            </p>
          </div>

          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-4">
                <div className="w-2 h-2 bg-accent rounded-full" />
                Operational License
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                We grant you a non-exclusive license to use our AI orchestration
                tools for personal professional development. Commercial
                redistribution of the underlying engine is strictly prohibited.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-4">
                <div className="w-2 h-2 bg-slate-200 rounded-full" />
                AI Output Ownership
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                You retain full ownership of all synthesized resumes. We claim
                no intellectual property rights over the documents forged within
                your local vault.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-4">
                <div className="w-2 h-2 bg-slate-200 rounded-full" />
                System Fair-Use
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                Automated scraping or bot-driven "Forge" sequences that exceed
                standard human thresholds may trigger a temporary lockout from
                the mesh to protect system integrity.
              </p>
            </section>
          </div>

          <div className="pt-12 border-t border-slate-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              Operational Since: March 19, 2026
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
