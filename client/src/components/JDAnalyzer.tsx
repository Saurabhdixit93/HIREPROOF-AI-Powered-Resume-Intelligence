"use client";

import { useState } from "react";
import { Sparkles, Target, List, AlertCircle, CheckCircle2, Zap } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { AIService } from "@/services/AIService";
import { motion, AnimatePresence } from "framer-motion";

export function JDAnalyzer() {
  const { resume } = useResumeStore();
  const [jd, setJd] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!jd.trim()) return;
    setAnalyzing(true);
    try {
      const response = await AIService.analyzeJD(jd);
      setAnalysis(response.data?.data);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Tactical link failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
           <div className="p-3 rounded-xl bg-accent/10">
              <Target className="w-6 h-6 text-accent" />
           </div>
           <div>
              <h3 className="text-xl font-display font-black uppercase tracking-tight">Mission Alignment</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Job Description Analysis</p>
           </div>
        </div>
        
        <p className="text-sm text-slate-500 font-medium leading-relaxed">
          Input the objective parameters (Job Description) to calculate matching coefficient and identify tactical gaps in your narrative.
        </p>

        <textarea 
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          className="w-full h-56 p-8 rounded-[32px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-200 outline-none transition-all resize-none font-sans text-sm text-slate-600 leading-relaxed"
          placeholder="PASTE TARGET JD HERE..."
        />

        <button 
          onClick={handleAnalyze}
          disabled={analyzing || !jd.trim()}
          className="btn-accent w-full py-5 flex items-center justify-center gap-4 shadow-xl shadow-accent/20"
        >
          {analyzing ? (
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin"></div>
              <span className="uppercase font-black tracking-widest text-xs">Matching Vectors...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span className="uppercase font-black tracking-widest text-xs">Calculate Match</span>
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {analysis && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 mt-12"
          >
             {/* Score Card */}
             <div className="p-10 rounded-[40px] bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent/20 blur-[100px] -z-0" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-end mb-10">
                     <div>
                        <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.4em] mb-3">Compatibility Index</p>
                        <h4 className="text-7xl font-display font-black text-white leading-none">{analysis.score}% <span className="text-accent text-3xl font-black italic">FIT</span></h4>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em] mb-2">Target Profile</p>
                        <p className="font-black text-sm uppercase text-accent tracking-tight">{analysis.role}</p>
                     </div>
                  </div>
                  <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${analysis.score}%` }}
                       transition={{ duration: 1.5, ease: "easeOut" }}
                       className="h-full bg-gradient-to-r from-accent to-blue-400 relative"
                     >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                     </motion.div>
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm">
                   <h5 className="text-[10px] uppercase font-black text-slate-400 tracking-[0.3em] mb-6 flex items-center gap-3">
                      <AlertCircle className="w-4 h-4 text-orange-400" />
                      MISSING KEYWORDS
                   </h5>
                   <div className="flex flex-wrap gap-2.5">
                      {analysis.missingKeywords.map((k: string) => (
                        <span key={k} className="px-3 py-1.5 rounded-xl bg-orange-50/50 border border-orange-100 text-[10px] font-black text-orange-700 uppercase tracking-widest">{k}</span>
                      ))}
                   </div>
                </div>

                <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm">
                   <h5 className="text-[10px] uppercase font-black text-slate-400 tracking-[0.3em] mb-6 flex items-center gap-3">
                      <List className="w-4 h-4 text-accent" />
                      STRATEGIC SUGGESTIONS
                   </h5>
                   <ul className="space-y-4">
                      {analysis.suggestions.map((s: string, i: number) => (
                        <li key={i} className="flex gap-4 text-[11px] font-bold text-slate-600 leading-relaxed uppercase tracking-tight">
                           <CheckCircle2 className="w-4 h-4 shrink-0 text-accent" />
                           {s}
                        </li>
                      ))}
                   </ul>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
