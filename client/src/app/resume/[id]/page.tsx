"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { ResumeService } from "@/services/ResumeService";
import {
  Sparkles,
  Save,
  Download,
  Eye,
  Layout as LayoutIcon,
  Type,
  ChevronLeft,
  Share2,
  Globe,
  Plus,
  Brain,
  CheckCircle2,
  Bot,
  Wand2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useResumeStore } from "@/store/useResumeStore";
import { SectionEditor } from "@/components/SectionEditor";
import { AIOptimizer } from "@/components/AIOptimizer";
import { JDAnalyzer } from "@/components/JDAnalyzer";
import { apiClient } from "@/lib/apiClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumePage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { resume, setResume, updateBasics } = useResumeStore();
  const [activeTab, setActiveTab] = useState("content");

  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { data: dbResume, isLoading: loading } = useQuery({
    queryKey: ["resume", id],
    queryFn: async () => {
      console.log(`📡 API FETCH: Resume ${id} (Triggered)`);
      const response = await ResumeService.getById(id as string);
      return response.data;
    },
    enabled: !!id,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const initializedId = useRef<string | null>(null);

  useEffect(() => {
    if (dbResume && initializedId.current !== id) {
      console.log(`🧠 INITIALIZING STORE for resume: ${id}`);
      setResume(dbResume);
      initializedId.current = id as string;
    }
  }, [dbResume, id, setResume]);

  const handleSave = async () => {
    if (!resume) return;
    setSaving(true);
    try {
      await ResumeService.update(id as string, resume);
      queryClient.setQueryData(["resume", id], resume);
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      console.log("Resume saved successfully");
    } catch (error) {
      console.error("Failed to save resume", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!resume) return;
    setExporting(true);
    try {
      const response = await apiClient.post(`/exports/pdf`, { resumeId: id });
      const message =
        response.data?.data?.message || "PDF generation has been queued.";
      toast.success(message);
    } catch (error) {
      console.error("Failed to export PDF", error);
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-accent rounded-full animate-spin"></div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Initializing Engine
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#f8fafc] overflow-hidden">
      {/* Modern Header */}
      <header className="h-20 border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-[100] px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-all group"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
          </button>
          <div className="h-4 w-[1px] bg-slate-200"></div>
          <div>
            <h1 className="font-display font-black text-xl tracking-tight text-primary leading-none uppercase">
              {resume?.title}
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                Auto-Sync Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-3 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-primary transition-all">
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-primary/30 border-t-primary"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Syncing..." : "Manual Sync"}
          </button>
          <button
            onClick={handleDownload}
            disabled={exporting}
            className="btn-primary flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20"
          >
            {exporting ? (
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white/30 border-t-white"></div>
            ) : (
              <Download className="w-4 h-4" />
            )}
            {exporting ? "Forging PDF..." : "Export File"}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Spatial Sidebar - Adaptive Width */}
        <aside className="w-20 md:w-24 border-r border-slate-100 bg-white flex flex-col items-center py-6 md:py-10 gap-6 md:gap-8 z-20">
          {[
            { id: "content", icon: Type, label: "DATA" },
            { id: "design", icon: LayoutIcon, label: "VIEW" },
            { id: "ai", icon: Sparkles, label: "AI" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all ${activeTab === tab.id ? "bg-primary text-white shadow-xl shadow-primary/10" : "text-slate-300 hover:bg-slate-50 hover:text-slate-500"}`}
              >
                <tab.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span
                className={`text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] transition-colors ${activeTab === tab.id ? "text-primary" : "text-slate-300 group-hover:text-slate-500"}`}
              >
                {tab.label}
              </span>
            </button>
          ))}

          <button
            onClick={() => setActiveTab("preview")}
            className={`mt-auto flex flex-col items-center gap-2 lg:hidden group`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === "preview" ? "bg-accent text-white shadow-xl shadow-accent/10" : "text-slate-300 hover:bg-slate-50"}`}
            >
              <Eye className="w-5 h-5" />
            </div>
            <span
              className={`text-[7px] font-black uppercase tracking-[0.2em] transition-colors ${activeTab === "preview" ? "text-primary" : "text-slate-300"}`}
            >
              LIVE
            </span>
          </button>
        </aside>

        {/* Editor Area - Responsive Padding */}
        <div
          className={`flex-1 flex overflow-hidden bg-white ${activeTab === "preview" ? "hidden" : "flex"}`}
        >
          <div className="flex-1 overflow-y-auto px-6 py-10 md:px-12 md:py-16 scrollbar-hide">
            <div className="max-w-3xl mx-auto">
              <AnimatePresence mode="wait">
                {activeTab === "content" && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-20"
                  >
                    {/* Basics */}
                    <section className="space-y-10">
                      <div className="flex items-center gap-4">
                        <div className="h-[2px] w-8 bg-accent"></div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                          Identity Protocol
                        </h2>
                      </div>
                      <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                        <div className="col-span-2 space-y-3">
                          <label className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">
                            Full Legal Name
                          </label>
                          <input
                            className="w-full text-5xl font-display font-black border-b border-slate-100 hover:border-slate-200 focus:border-primary outline-none transition-all pb-4 placeholder:text-slate-100"
                            placeholder="THE ARCHITECT"
                            value={resume?.basics?.fullName || ""}
                            onChange={(e) =>
                              updateBasics({ fullName: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">
                            Deployment Email
                          </label>
                          <input
                            className="w-full text-lg font-bold border-b border-slate-100 hover:border-slate-200 focus:border-primary outline-none transition-all pb-2 placeholder:text-slate-100"
                            placeholder="name@domain.com"
                            value={resume?.basics?.email || ""}
                            onChange={(e) =>
                              updateBasics({ email: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">
                            Secure Line
                          </label>
                          <input
                            className="w-full text-lg font-bold border-b border-slate-100 hover:border-slate-200 focus:border-primary outline-none transition-all pb-2 placeholder:text-slate-100"
                            placeholder="+X XXX XXX XXXX"
                            value={resume?.basics?.phone || ""}
                            onChange={(e) =>
                              updateBasics({ phone: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">
                            Operational Base (Location)
                          </label>
                          <input
                            className="w-full text-lg font-bold border-b border-slate-100 hover:border-slate-200 focus:border-primary outline-none transition-all pb-2 placeholder:text-slate-100"
                            placeholder="City, State"
                            value={resume?.basics?.location || ""}
                            onChange={(e) =>
                              updateBasics({ location: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">
                            LinkedIn Handle/Link
                          </label>
                          <input
                            className="w-full text-lg font-bold border-b border-slate-100 hover:border-slate-200 focus:border-primary outline-none transition-all pb-2 placeholder:text-slate-100"
                            placeholder="linkedin.com/in/..."
                            value={
                              resume?.basics?.links?.find(
                                (l) => l.label === "LinkedIn",
                              )?.url || ""
                            }
                            onChange={(e) => {
                              const otherLinks = (
                                resume?.basics?.links || []
                              ).filter((l) => l.label !== "LinkedIn");
                              updateBasics({
                                links: [
                                  ...otherLinks,
                                  { label: "LinkedIn", url: e.target.value },
                                ],
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">
                            GitHub Handle/Link
                          </label>
                          <input
                            className="w-full text-lg font-bold border-b border-slate-100 hover:border-slate-200 focus:border-primary outline-none transition-all pb-2 placeholder:text-slate-100"
                            placeholder="github.com/..."
                            value={
                              resume?.basics?.links?.find(
                                (l) => l.label === "GitHub",
                              )?.url || ""
                            }
                            onChange={(e) => {
                              const otherLinks = (
                                resume?.basics?.links || []
                              ).filter((l) => l.label !== "GitHub");
                              updateBasics({
                                links: [
                                  ...otherLinks,
                                  { label: "GitHub", url: e.target.value },
                                ],
                              });
                            }}
                          />
                        </div>
                      </div>
                    </section>

                    {/* Summary */}
                    <section className="space-y-10">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="h-[2px] w-8 bg-accent"></div>
                          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                            Executive Narrative
                          </h2>
                        </div>
                        <button
                          onClick={() => setActiveTab("ai")}
                          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-accent hover:text-primary transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Optimize
                        </button>
                      </div>
                      <textarea
                        className="w-full h-48 p-8 rounded-3xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-200 outline-none transition-all resize-none text-slate-600 font-medium leading-relaxed"
                        placeholder="Synthesize your professional impact..."
                        value={resume?.basics?.summary || ""}
                        onChange={(e) =>
                          updateBasics({ summary: e.target.value })
                        }
                      />
                    </section>

                    <SectionEditor />
                  </motion.div>
                )}

                {activeTab === "design" && (
                  <motion.div
                    key="design"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-12"
                  >
                    <div>
                      <h2 className="text-4xl font-display font-black tracking-tight mb-3 uppercase">
                        Visual Identity
                      </h2>
                      <p className="text-slate-500 font-medium text-lg">
                        Select the optimal presentation framework.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      {[
                        {
                          id: "professional",
                          name: "The Standard",
                          description: "Minimalist Authority",
                        },
                        {
                          id: "modern",
                          name: "High Velocity",
                          description: "Clean & Impactful",
                        },
                        {
                          id: "creative",
                          name: "The Alchemist",
                          description: "Bold Visual Narrative",
                        },
                        {
                          id: "minimal",
                          name: "Ghost Protocol",
                          description: "Pure Typographic Focus",
                        },
                      ].map((t) => (
                        <motion.div
                          key={t.id}
                          whileHover={{ y: -5 }}
                          onClick={() => {
                            if (resume) {
                              setResume({
                                ...resume,
                                metadata: {
                                  ...resume.metadata,
                                  templateId: t.id,
                                },
                              });
                            }
                          }}
                          className={`p-8 rounded-[32px] border-2 transition-all cursor-pointer group relative overflow-hidden ${resume?.metadata?.templateId === t.id ? "border-primary bg-primary/5 shadow-2xl" : "border-slate-100 hover:border-slate-200 bg-white"}`}
                        >
                          <div className="aspect-[3/4] bg-slate-50 rounded-2xl mb-6 group-hover:scale-[1.02] transition-transform overflow-hidden shadow-inner flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-[2px] bg-slate-200"></div>
                            <div className="w-8 h-[2px] bg-slate-200"></div>
                            <div className="w-16 h-[2px] bg-slate-200"></div>
                          </div>
                          <p className="font-black uppercase tracking-widest text-xs mb-1.5">
                            {t.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                            {t.description}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "ai" && (
                  <motion.div
                    key="ai"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-16"
                  >
                    <AIOptimizer />
                    <div className="h-[2px] w-full bg-slate-50" />
                    <JDAnalyzer />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* High-Fidelity Preview Container */}
          <div className="hidden lg:flex flex-1 bg-[#e2e8f0] overflow-y-auto p-4 items-center flex-col relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-5 pointer-events-none" />

            <motion.div
              layoutId="resume-preview"
              className="w-[210mm] min-h-[297mm] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] p-[25mm] origin-top relative group"
            >
              {/* Paper texture overlay */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/creampaper.png')] opacity-[0.03] pointer-events-none" />

              <div className="border-b-[6px] border-primary pb-8 mb-20">
                <h1 className="text-5xl font-display font-black uppercase tracking-tighter leading-none">
                  {resume?.basics?.fullName || "ENTITY NAME"}
                </h1>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                  <span className="flex items-center gap-2">
                    <Globe className="w-3 h-3 text-accent" />{" "}
                    {resume?.basics?.location || "REMOTE_OPS"}
                  </span>
                  <span>•</span>
                  <span>{resume?.basics?.email || "LINK_ESTABLISHED"}</span>
                  {resume?.basics?.phone && (
                    <>
                      <span>•</span>
                      <span>{resume?.basics?.phone}</span>
                    </>
                  )}
                  {resume?.basics?.links
                    ?.filter((l) => l.url)
                    .map((link, idx) => (
                      <React.Fragment key={idx}>
                        <span>•</span>
                        <span>
                          {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                        </span>
                      </React.Fragment>
                    ))}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-16">
                <div className="col-span-8 space-y-16">
                  <section>
                    <div className="flex items-center gap-4 mb-8">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary whitespace-nowrap">
                        Tactical Operations
                      </h3>
                      <div className="h-[1px] w-full bg-slate-100"></div>
                    </div>
                    <div className="space-y-12">
                      {resume?.sections?.work?.length ? (
                        resume.sections.work.map((work: any, index: number) => (
                          <div
                            key={index}
                            className="relative pl-8 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-accent before:rounded-full after:absolute after:left-[2px] after:top-4 after:bottom-[-3rem] after:w-[1px] after:bg-slate-100 last:after:hidden"
                          >
                            <div className="flex justify-between items-baseline mb-2">
                              <h4 className="font-black text-2xl tracking-tight leading-none text-slate-800">
                                {work.position || "PROTOCOL_NULL"}
                              </h4>
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                {work.startDate || "START"} —{" "}
                                {work.endDate || "PRESENT"}
                              </span>
                            </div>
                            <p className="text-accent font-black uppercase tracking-widest text-[10px] mb-4">
                              {work.company || "CORPORATION"}
                            </p>
                            {work.highlights?.length > 0 && (
                              <ul className="space-y-3">
                                {work.highlights.map((h: string, i: number) => (
                                  <li
                                    key={i}
                                    className="text-slate-600 text-[11px] font-medium leading-relaxed flex gap-3"
                                  >
                                    <span className="text-accent mt-1.5">
                                      •
                                    </span>
                                    {h}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="h-20 flex items-center justify-center border border-dashed border-slate-100 rounded-xl">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                            Awaiting Data Ingestion
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                <div className="col-span-4 space-y-16">
                  {/* Skills Section */}
                  <section>
                    <div className="flex items-center gap-4 mb-8">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary whitespace-nowrap">
                        Core Assets
                      </h3>
                      <div className="h-[1px] w-full bg-slate-100"></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resume?.sections?.skills?.length
                        ? resume.sections.skills.map((skill: any) => (
                            <span
                              key={skill.name}
                              className="px-2.5 py-1 bg-slate-50 text-slate-800 text-[9px] font-black uppercase tracking-widest rounded border border-slate-100"
                            >
                              {skill.name}
                            </span>
                          ))
                        : ["React", "TypeScript", "Node.js"].map((s) => (
                            <span
                              key={s}
                              className="px-2.5 py-1 bg-slate-50/50 text-slate-300 text-[9px] font-black uppercase tracking-widest rounded border border-slate-100 border-dashed opacity-50"
                            >
                              {s}
                            </span>
                          ))}
                    </div>
                  </section>

                  {/* Education Section */}
                  <section>
                    <div className="flex items-center gap-4 mb-8">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary whitespace-nowrap">
                        Knowledge Center
                      </h3>
                      <div className="h-[1px] w-full bg-slate-100"></div>
                    </div>
                    <div className="space-y-8">
                      {resume?.sections?.education?.length ? (
                        resume.sections.education.map(
                          (edu: any, index: number) => (
                            <div key={index} className="space-y-2">
                              <h4 className="font-black text-sm text-slate-800 uppercase leading-tight">
                                {edu.studyType || "DEGREE"}
                              </h4>
                              <p className="text-accent font-bold uppercase text-[9px] tracking-widest">
                                {edu.institution || "INSTITUTION"}
                              </p>
                              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                {edu.startDate || "START"} —{" "}
                                {edu.endDate || "END"}
                              </div>
                            </div>
                          ),
                        )
                      ) : (
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                          Records Pending
                        </p>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
