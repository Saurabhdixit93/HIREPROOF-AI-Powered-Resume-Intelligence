"use client";

import { Layout } from "@/components/Layout";
import { HelpCircle, MessageCircle, BookOpen, Mail, ExternalLink, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const faqs = [
  {
    q: "Which AI providers are supported?",
    a: "HIREPROOF supports OpenAI, Anthropic (Claude), Google Gemini, OpenRouter, and NVIDIA — with automatic failover if one is unavailable."
  },
  {
    q: "Is my data secure?",
    a: "Yes. All data is encrypted in transit and at rest. Your resumes are stored in MongoDB with user-scoped access. We never share your data with third parties."
  },
  {
    q: "Can I export my resume as PDF?",
    a: "Absolutely. Use the Export button in the Resume Editor to generate a pixel-perfect PDF from any of the 4 professional templates."
  },
  {
    q: "What is JD Match Analysis?",
    a: "Paste a Job Description and our AI will calculate a compatibility score, identify missing keywords, and suggest tactical improvements."
  },
  {
    q: "How does version history work?",
    a: "Every time you save or run an AI optimization, a snapshot is created. You can browse, compare, and restore any previous version."
  },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const fadeUp = {
  hidden: { y: 10, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function SupportPage() {
  return (
    <Layout>
      <div className="mb-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 mb-6">
          <div className="h-[2px] w-12 bg-accent" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Help Center</span>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-primary leading-tight uppercase">Support</h1>
        <p className="text-slate-500 text-lg font-medium mt-4 max-w-2xl">
          Everything you need to master the HIREPROOF platform.
        </p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { icon: MessageCircle, title: "Live Chat", desc: "Talk to us in real-time", action: "Open Chat", color: "bg-accent" },
          { icon: Mail, title: "Email Support", desc: "support@hireproof.ai", action: "Send Email", color: "bg-primary" },
          { icon: BookOpen, title: "Documentation", desc: "Guides and tutorials", action: "Browse Docs", color: "bg-violet-500" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-[32px] p-8 group hover:shadow-floating transition-all"
          >
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
              <item.icon className="w-7 h-7" />
            </div>
            <h3 className="font-black text-xl mb-2">{item.title}</h3>
            <p className="text-sm text-slate-400 font-medium mb-6">{item.desc}</p>
            <button className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2 hover:text-primary transition-colors">
              {item.action} <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* FAQs */}
      <div>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-primary/10">
            <HelpCircle className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-black text-2xl uppercase tracking-tight">Frequently Asked Questions</h3>
        </div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.details
              key={i}
              variants={fadeUp}
              className="glass rounded-2xl group"
            >
              <summary className="p-6 cursor-pointer font-black text-sm uppercase tracking-tight flex items-center justify-between list-none">
                {faq.q}
                <Zap className="w-4 h-4 text-accent shrink-0 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-sm text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-4">
                {faq.a}
              </div>
            </motion.details>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
}
