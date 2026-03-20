"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import gsap from "gsap";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  useEffect(() => {
    // Subtle aurora drift
    gsap.to(".aurora-bg", {
      backgroundPosition: "40% 40%",
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="aurora-bg" />
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Branding */}
        <div className="flex flex-col items-center mb-12">
          <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transition-all group-hover:shadow-primary/40 group-hover:-rotate-3">
              <span className="text-white font-bold text-2xl">H</span>
            </div>
            <span className="font-display font-black text-3xl tracking-tighter text-primary">HIREPROOF</span>
          </Link>
        </div>

        {/* glass Card */}
        <div className="glass p-10 rounded-[2.5rem] bg-white/40 shadow-floating">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-display font-black text-primary mb-2 leading-tight">
              {title}
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              {subtitle}
            </p>
          </div>

          {children}
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pointer-events-none">
          Proprietary Intelligence Suite — HIREPROOF™
        </div>
      </motion.div>
    </div>
  );
}
