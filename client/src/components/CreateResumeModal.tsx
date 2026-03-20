"use client";

import { useState } from "react";
import { X, Sparkles, Rocket, Cpu } from "lucide-react";
import { ResumeService } from "@/services/ResumeService";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateResumeModal({ isOpen, onClose }: ModalProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await ResumeService.create({
        title,
        basics: {
          fullName: "NEW ENTITY",
          email: "entity@mesh.net",
          links: [],
        },
        sections: {
          work: [],
          education: [],
          skills: [],
          projects: [],
          certifications: [],
          languages: [],
        },
      });
      // Invalidate the resumes cache so it fetches the fresh list on dashboard revisit
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      
      router.push(`/resume/${response.data._id}`);
      onClose();
    } catch (error) {
      console.error("Failed to create resume", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-[40px] p-12 w-full max-w-lg relative border border-slate-100 shadow-floating z-10 overflow-hidden"
        >
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[60px] -z-0" />
          
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-all text-slate-300 hover:text-primary z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <Cpu className="w-6 h-6 text-white" />
               </div>
               <div>
                  <h2 className="text-2xl font-display font-black uppercase tracking-tight leading-none">Initialize Forge</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 leading-none">Protocol 7-B: Baseline Creation</p>
               </div>
            </div>

            <p className="text-slate-500 font-medium leading-relaxed mb-10">
              Assign a unique identifier to your new professional container. This title will serve as the primary key in your trajectory management system.
            </p>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-1">Assignment Title</label>
                <input
                  autoFocus
                  type="text"
                  required
                  className="w-full text-xl font-black uppercase tracking-tight border-b-2 border-slate-100 focus:border-accent bg-transparent outline-none transition-all pb-4 placeholder:text-slate-100"
                  placeholder="E.G. LEAD ARCHITECT - META"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !title}
                className="btn-primary w-full py-5 flex items-center justify-center gap-4 relative overflow-hidden"
              >
                {loading ? (
                  <div className="flex items-center gap-4">
                     <div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin"></div>
                     <span className="text-xs font-black uppercase tracking-widest">Constructing...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-accent" />
                    <span className="text-xs font-black uppercase tracking-widest">Execute Creation</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
