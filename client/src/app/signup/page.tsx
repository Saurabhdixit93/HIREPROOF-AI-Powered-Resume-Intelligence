"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AuthLayout } from "@/components/AuthLayout";
import { User, Mail, Lock, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Step 1: Register the user via the proxied API
      const signupRes = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const signupData = await signupRes.json();

      if (!signupRes.ok || !signupData.success) {
        setError(signupData.message || "Registration failed");
        setLoading(false);
        return;
      }

      // Step 2: Auto-login the new user via NextAuth
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
      }, 1000);
    } catch (err: any) {
      setError("Registration failed");
      setLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 10, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join the elite resume builder platform."
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div variants={item} className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Universal Tag</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all font-medium text-sm"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </motion.div>

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
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Security Key</label>
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
              <>
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                Welcome Aboard
              </>
            ) : (
              <>
                Commence Integration
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        <motion.p variants={item} className="text-center mt-10 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Existing Operative?{" "}
          <Link href="/login" className="text-accent hover:text-primary transition-colors px-1">
            Access Session
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
}
