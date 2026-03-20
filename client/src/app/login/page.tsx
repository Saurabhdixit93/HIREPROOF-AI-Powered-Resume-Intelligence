"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AuthLayout } from "@/components/AuthLayout";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 800);
    } catch (err: any) {
      setError("Authentication failed");
      setLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 10, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Log in to continue building your success story."
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={success ? "auth-victory-pulse pointer-events-none" : ""}
      >
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-destructive/5 border border-destructive/10 text-destructive text-xs font-bold p-4 rounded-2xl mb-8 flex items-center gap-3 overflow-hidden"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={item} className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Identity Vector</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent transition-colors" />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all font-medium text-sm"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </motion.div>

          <motion.div variants={item} className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Key</label>
              <Link href="#" className="text-[9px] font-black uppercase tracking-widest text-accent hover:text-primary transition-colors">Emergency Reset?</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent transition-colors" />
              <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all font-medium text-sm"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </motion.div>

          <motion.button
            variants={item}
            type="submit"
            disabled={loading || success}
            className="w-full py-4 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-6 shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
            ) : success ? (
              "Access Granted"
            ) : (
              <>
                Initialize Session
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        <motion.p variants={item} className="text-center mt-10 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          New to the suite?{" "}
          <Link href="/signup" className="text-accent hover:text-primary transition-colors px-1">
            Recruit Account
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
}
