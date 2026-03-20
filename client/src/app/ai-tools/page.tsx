"use client";

import { Layout } from "@/components/Layout";
import {
  Sparkles,
  Brain,
  Target,
  FileText,
  Zap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const tools = [
  {
    icon: Brain,
    title: "Summary Generator",
    description:
      "AI rewrites your executive summary for maximum recruiter impact using behavioral psychology frameworks.",
    action: "Generate Summary",
    color: "bg-blue-500",
    href: null,
    badge: "Most Popular",
  },
  {
    icon: Target,
    title: "JD Match Analyzer",
    description:
      "Paste a job description to get a compatibility score, missing keywords, and tactical improvement suggestions.",
    action: "Analyze Match",
    color: "bg-accent",
    href: null,
    badge: "High Impact",
  },
  {
    icon: Sparkles,
    title: "Bullet Optimizer",
    description:
      "Transform generic bullet points into quantified, action-driven achievements that pass ATS filters.",
    action: "Optimize Bullets",
    color: "bg-violet-500",
    href: null,
    badge: null,
  },
  {
    icon: FileText,
    title: "Resume Tailor",
    description:
      "Auto-tailor your entire resume to a specific job description while maintaining authenticity.",
    action: "Tailor Resume",
    color: "bg-emerald-500",
    href: null,
    badge: null,
  },
  {
    icon: Sparkles,
    title: "Cover Letter Forge",
    description:
      "Upload your resume and a JD to generate highly-tailored, professional cover letters in seconds.",
    action: "Forge Letter",
    color: "bg-primary",
    href: "/cover-letter",
    badge: "New",
  },
];

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function AIToolsPage() {
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
            Neural Engine Suite
          </span>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-primary leading-tight uppercase">
          AI Tools
        </h1>
        <p className="text-slate-500 text-lg font-medium mt-4 max-w-2xl">
          Select a resume from your vault, then deploy any of these AI-powered
          optimization protocols.
        </p>
      </div>

      {/* Provider Info */}
      <div className="glass rounded-3xl p-6 mb-12 flex items-center gap-4">
        <Zap className="w-5 h-5 text-accent shrink-0" />
        <p className="text-sm font-bold text-slate-600">
          Powered by <span className="text-primary">5 AI providers</span> —
          OpenAI, Anthropic, Gemini, OpenRouter, and NVIDIA with automatic
          failover.
        </p>
      </div>

      {/* Tools Grid */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {tools.map((tool, i) => {
          const content = (
            <>
              {tool.badge && (
                <span className="absolute top-6 right-6 px-3 py-1 rounded-full bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest">
                  {tool.badge}
                </span>
              )}

              <div
                className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}
              >
                <tool.icon className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-black tracking-tight mb-3">
                {tool.title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                {tool.description}
              </p>

              <p className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
                {tool.href ? "Launch Tool" : "Open a resume to use this tool"}{" "}
                <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </>
          );

          return tool.href ? (
            <Link
              key={i}
              href={tool.href}
              className="glass rounded-[32px] p-8 group relative overflow-hidden hover:shadow-floating transition-all block"
            >
              {content}
            </Link>
          ) : (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -5 }}
              className="glass rounded-[32px] p-8 group relative overflow-hidden hover:shadow-floating transition-all"
            >
              {content}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Access CTA */}
      <div className="mt-16 text-center">
        <p className="text-sm font-bold text-slate-400 mb-4">
          All AI tools are accessible inside the Resume Editor
        </p>
        <Link
          href="/resumes"
          className="btn-primary inline-flex items-center gap-3"
        >
          Go to My Resumes <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </Layout>
  );
}
