"use client";

import { motion } from "framer-motion";
import { Shield, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
          <Shield className="w-5 h-5 text-accent" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
            Privacy Protocol v4.2
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
              Confidentiality Agreement
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase leading-none mb-8">
              Privacy <br /> Policy
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
              We operate on a zero-trust architecture. Your professional data is
              synthesized using secure tactical links and never sold to
              third-party entities.
            </p>
          </div>

          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-4">
                <div className="w-2 h-2 bg-accent rounded-full" />
                Data Ingestion
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                We collect essential professional metrics (resume content,
                contact details) strictly to power the AI synthesis engine. This
                data transition occurs over encrypted SSL protocols.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-4">
                <div className="w-2 h-2 bg-slate-200 rounded-full" />
                AI Processing
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                When you execute "Forge" or "Optimize" commands, data is
                processed via secure API endpoints (OpenAI, Anthropic, Gemini).
                No data remains in their training sets unless explicitly opted
                in.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-4">
                <div className="w-2 h-2 bg-slate-200 rounded-full" />
                Data Autonomy
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                Users retain 100% control over their intelligence documents.
                Deletion from the "Vault" triggers a permanent removal sequence
                from our primary clusters.
              </p>
            </section>
          </div>

          <div className="pt-12 border-t border-slate-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              Last System Update: March 19, 2026
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
