"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { Sparkles, Brain, CheckCircle2, AlertCircle, ChevronDown, Rocket, Cpu, Zap } from "lucide-react";
import { useState } from "react";
import { AIService } from "@/services/AIService";
import { motion, AnimatePresence } from "framer-motion";

const PROVIDERS = ["openai", "anthropic", "gemini", "openrouter", "nvidia"];
const NVIDIA_MODELS = [
  'mistralai/mistral-small-4-119b-2603',
  'meta/llama-3.1-405b-instruct',
  'meta/llama-3.1-70b-instruct',
  'google/gemma-2-27b-it',
  'mistralai/mixtral-8x7b-instruct-v0.1',
  'nvidia/llama-3.1-nemotron-70b-instruct'
];

export function AIOptimizer() {
  const { resume, updateBasics } = useResumeStore();
  const [analyzing, setAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [provider, setProvider] = useState("openai");
  const [model, setModel] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!resume) return null;

  const handleGenerateSummary = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const selectedModel = provider === 'nvidia' ? (model || NVIDIA_MODELS[0]) : (provider === 'openrouter' ? model : undefined);
      
      const response = await AIService.generateSummary(resume, provider, selectedModel);
      const content = response.data?.data?.content;
      
      if (content) {
        setSuggestions([content]);
      } else {
        setSuggestions(["AI protocol returned zero high-confidence variants."]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Tactical link failed. Check connection.");
    } finally {
      setAnalyzing(false);
    }
  };

  const applySummary = (text: string) => {
    updateBasics({ summary: text });
    setSuggestions([]);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Settings Panel */}
      <div className="p-8 rounded-[32px] bg-slate-900 text-white shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-[80px] -z-0" />
        
        <div className="relative z-10">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3 mb-6">
            <Cpu className="w-3.5 h-3.5 text-accent" />
            Neural Engine Configuration
          </h4>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Logic Provider</label>
              <div className="relative">
                <select 
                  value={provider}
                  onChange={(e) => {
                    setProvider(e.target.value);
                    if (e.target.value === 'nvidia') setModel(NVIDIA_MODELS[0]);
                    else setModel("");
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest p-3 appearance-none focus:ring-2 focus:ring-accent/50 outline-none transition-all"
                >
                  {PROVIDERS.map(p => <option key={p} value={p} className="text-primary">{p.toUpperCase()}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
              </div>
            </div>

            {(provider === "nvidia" || provider === "openrouter") && (
              <div className="space-y-2.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Model Index</label>
                {provider === "nvidia" ? (
                  <div className="relative">
                    <select 
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest p-3 appearance-none focus:ring-2 focus:ring-accent/50 outline-none transition-all"
                    >
                      {NVIDIA_MODELS.map(m => <option key={m} value={m} className="text-primary">{m.split('/').pop()?.toUpperCase()}</option>)}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                  </div>
                ) : (
                  <input 
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="MINIMAX/..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest p-3 focus:ring-2 focus:ring-accent/50 outline-none placeholder:text-slate-700 transition-all"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Action */}
      <div className="glass p-10 rounded-[40px] relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />
        
        <div className="flex items-center gap-5 mb-8">
          <div className="p-4 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
            <Brain className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight leading-none uppercase">Narrative Optimization</h3>
            <p className="text-[10px] text-accent uppercase font-black tracking-[0.2em] mt-2 flex items-center gap-2">
               <Zap className="w-3 h-3 animate-pulse" /> Linked to {provider.toUpperCase()} Global Mesh
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10">
          Execute specialized rewriting protocols to maximize impact vectors. Our AI calibrates your executive summary for high-frequency hiring signals.
        </p>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-8 p-4 rounded-2xl bg-red-50/50 border border-red-100 flex items-start gap-4"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-red-600 font-black uppercase tracking-widest leading-relaxed">{error}</p>
          </motion.div>
        )}

        <button 
          onClick={handleGenerateSummary}
          disabled={analyzing}
          className="w-full py-5 rounded-[24px] bg-primary text-white font-black uppercase tracking-[0.25em] text-xs flex items-center justify-center gap-4 hover:bg-slate-800 transition-all disabled:opacity-50 shadow-2xl shadow-primary/10 relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {analyzing ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-4"
              >
                <div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Synthesizing...</span>
              </motion.div>
            ) : (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-4"
              >
                <Sparkles className="w-5 h-5 text-accent" />
                <span>Execute Optimization</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 mt-12 pb-12">
          <div className="flex items-center gap-4">
             <div className="h-[2px] w-8 bg-accent"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Generated Prototypes</p>
          </div>
          {suggestions.map((s, i) => (
            <motion.div 
              key={i} 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 rounded-[32px] border border-slate-100 bg-white shadow-xl group hover:border-accent/40 transition-all"
            >
              <div className="flex gap-5">
                 <div className="p-2 rounded-lg bg-green-50 text-green-500 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <p className="text-sm text-slate-600 leading-relaxed font-semibold italic">"{s}"</p>
              </div>
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => applySummary(s)}
                  className="px-6 py-3 rounded-xl bg-slate-50 text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-3 hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  Apply Protocol <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
