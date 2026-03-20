"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Signal,
  ChevronLeft,
  Server,
  Globe,
  Cpu,
  Zap,
  Database,
} from "lucide-react";
import Link from "next/link";

export default function StatusPage() {
  const systems = [
    {
      name: "Intelligence Engine",
      status: "Operational",
      load: "12%",
      icon: Cpu,
    },
    {
      name: "Global Mesh (API)",
      status: "Operational",
      load: "24%",
      icon: Zap,
    },
    {
      name: "Vault Storage",
      status: "Operational",
      load: "8%",
      icon: Database,
    },
    {
      name: "PDF Forge Cluster",
      status: "Operational",
      load: "31%",
      icon: Server,
    },
    { name: "Auth Sentry", status: "Operational", load: "4%", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-50 px-8 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-all">
            <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-primary" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">
            Tactical Dashboard
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Activity className="w-5 h-5 text-green-500" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">
            All Systems Functional
          </span>
        </div>
      </header>

      <main className="pt-40 pb-20 px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <span className="text-[10px] font-black text-accent uppercase tracking-[0.5em] mb-4 block">
                Operational Pulse
              </span>
              <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase leading-none mb-4">
                System <br /> Status
              </h1>
              <p className="text-slate-500 font-medium">
                Real-time telemetry from our core infrastructure clusters.
              </p>
            </div>
            <div className="px-6 py-3 rounded-2xl bg-green-50 border border-green-100 flex items-center gap-3">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-sm font-black text-green-600 uppercase tracking-widest">
                Network 100% Active
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {systems.map((system, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 md:p-8 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:translate-x-2 transition-all border border-white/50"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform">
                    <system.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight leading-none mb-2">
                      {system.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Signal className="w-3 h-3 text-green-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {system.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="w-32 lg:w-48">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                        Network Load
                      </span>
                      <span className="text-[10px] font-black text-slate-500">
                        {system.load}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: system.load }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-accent rounded-full shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-12 border-t border-slate-100 flex justify-between items-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              Region: Global Cluster 01
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              Uptime: 99.98%
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
