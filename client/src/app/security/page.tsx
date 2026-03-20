"use client";

import { motion } from "framer-motion";
import { Lock, ShieldCheck, ChevronLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-accent selection:text-white selection:opacity-50">
      <header className="fixed top-0 left-0 right-0 h-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 z-50 px-8 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all border border-white/10">
            <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-white" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
            Tactical Dashboard
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Lock className="w-5 h-5 text-accent" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            Security Clearance TIER 1
          </span>
        </div>
      </header>

      <main className="pt-40 pb-20 px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-20"
        >
          <div className="relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent/20 blur-[120px] rounded-full -z-0" />
            <div className="relative z-10">
              <span className="text-[10px] font-black text-accent uppercase tracking-[0.5em] mb-4 block">
                Fortress Protocol
              </span>
              <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase leading-none mb-8">
                Security <br /> Architecture
              </h1>
              <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl">
                The Intelligence Engine is protected by multi-layer encryption
                and real-time threat monitoring. We adhere to the highest
                tactical standards for data preservation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Encryption at Rest",
                desc: "All vault data is encrypted using AES-256 standards before hitting our primary storage clusters.",
                icon: ShieldCheck,
              },
              {
                title: "In-Transit Security",
                desc: "TLS 1.3 encryption for every data transition. No unsecured links are permitted within the network.",
                icon: ShieldAlert,
              },
              {
                title: "Identity Protection",
                desc: "NextAuth based JWT authentication with secure session rotation and CSRF protection.",
                icon: Lock,
              },
              {
                title: "AI Sanitization",
                desc: "Strict PII (Personally Identifiable Information) handling protocols during external AI synthesis.",
                icon: ShieldCheck,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-accent/30 transition-all group"
              >
                <item.icon className="w-8 h-8 text-accent mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-black uppercase tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-10 rounded-[40px] bg-accent/5 border border-accent/10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)]">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase mb-1">
                Continuous Monitoring
              </h3>
              <p className="text-slate-400 text-sm font-medium">
                Our systems are audited 24/7 for operational anomalies and
                potential threat vectors.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
