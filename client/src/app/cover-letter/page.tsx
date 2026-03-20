"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Sparkles,
  Download,
  ChevronRight,
  ChevronLeft,
  Check,
  ArrowRight,
  History,
  FileSearch,
  Cpu,
  ChevronDown,
} from "lucide-react";

const PROVIDERS = ["openai", "anthropic", "gemini", "openrouter", "nvidia"];
const NVIDIA_MODELS = [
  "mistralai/mistral-small-4-119b-2603",
  "meta/llama-3.1-405b-instruct",
  "meta/llama-3.1-70b-instruct",
  "google/gemma-2-27b-it",
  "mistralai/mixtral-8x7b-instruct-v0.1",
  "nvidia/llama-3.1-nemotron-70b-instruct",
];
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { useResumeStore } from "@/store/useResumeStore";
import { Layout } from "@/components/Layout";

export default function CoverLetterPage() {
  const { resume } = useResumeStore();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [variations, setVariations] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [savedResumes, setSavedResumes] = useState<any[]>([]);

  const [provider, setProvider] = useState("openai");
  const [model, setModel] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Refs for custom scroll behavior or focus
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSavedResumes();
  }, []);

  const fetchSavedResumes = async () => {
    try {
      const res = await apiClient.get(`/cover-letter/saved-resumes`);
      if (res.data.success) {
        setSavedResumes(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch saved resumes");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    setUploading(true);
    try {
      const res = await apiClient.post(`/cover-letter/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setResumeText(res.data.data.text);
        toast.success("Resume parsed successfully!");
        setStep(2);
        fetchSavedResumes(); // Refresh saved list
      }
    } catch (err) {
      toast.error("Failed to parse resume");
    } finally {
      setUploading(false);
    }
  };

  const generateCoverLetters = async () => {
    if (!jobTitle || !jobDescription || !resumeText) {
      toast.error("Please provide all required fields");
      return;
    }

    setGenerating(true);
    setError(null);
    try {
      const selectedModel =
        provider === "nvidia"
          ? model || NVIDIA_MODELS[0]
          : provider === "openrouter"
            ? model
            : undefined;

      const res = await apiClient.post(`/cover-letter/generate`, {
        resumeText,
        jobTitle,
        jobDescription,
        provider,
        model: selectedModel,
      });

      if (res.data.success) {
        setVariations(res.data.data);
        setStep(3);
        toast.success("5 AI variations generated!");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Tactical link failed. Check connection.",
      );
      toast.error("Failed to generate cover letters");
    } finally {
      setGenerating(false);
    }
  };

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const res = await apiClient.post(
        `/cover-letter/download`,
        {
          content: variations[selectedIndex],
          name: resume?.basics?.fullName || "Candidate",
        },
        { responseType: "blob" },
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Cover_Letter.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Download started!");
    } catch (err) {
      toast.error("Failed to download PDF");
    } finally {
      setDownloading(false);
    }
  };

  const nextVariation = () =>
    setSelectedIndex((prev) => (prev + 1) % variations.length);
  const prevVariation = () =>
    setSelectedIndex(
      (prev) => (prev - 1 + variations.length) % variations.length,
    );

  return (
    <Layout>
      <div className="space-y-12 pb-20">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-black tracking-tighter uppercase">
                Cover Letter Forge
              </h1>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
              AI-Augmented Strategic Correspondence
            </p>
          </div>

          {/* Stepper UI */}
          <nav className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-8 px-4 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  step === s ? "bg-primary text-white" : "text-slate-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center border ${step === s ? "border-white/20" : "border-slate-100 text-[8px]"}`}
                >
                  {step > s ? <Check className="w-2.5 h-2.5" /> : s}
                </div>
                <span className={step === s ? "block" : "hidden md:block"}>
                  {s === 1 ? "Baseline" : s === 2 ? "Targeting" : "Selection"}
                </span>
              </div>
            ))}
          </nav>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <AnimatePresence mode="wait">
            {/* Step 1: Baseline (Resume Upload) */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-8 space-y-8"
              >
                <section className="bg-white rounded-[40px] p-12 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-2 h-full bg-primary opacity-20" />

                  <div className="space-y-8 relative">
                    <div className="space-y-4">
                      <h2 className="text-4xl font-black tracking-tight leading-none text-slate-800">
                        Establish your{" "}
                        <span className="text-primary italic">Baseline.</span>
                      </h2>
                      <p className="text-slate-500 font-medium leading-relaxed max-w-lg">
                        Upload your master resume to feed our models. We extract
                        the core logic, achievements, and skills to form the
                        foundation of your letter.
                      </p>
                    </div>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-4 border-dashed border-slate-100 rounded-[32px] p-16 flex flex-col items-center justify-center gap-6 hover:border-primary/30 hover:bg-slate-50/50 transition-all cursor-pointer group/upload"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf"
                      />
                      {uploading ? (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                            Deciphering Logic...
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover/upload:scale-110 transition-transform">
                            <Upload className="w-8 h-8" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-black uppercase tracking-widest text-slate-800">
                              Initialize Deployment
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 mt-2">
                              Support: PDF Documents (.pdf)
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {savedResumes.length > 0 && (
                      <div className="pt-8 border-t border-slate-100 space-y-6">
                        <div className="flex items-center gap-3 text-slate-400">
                          <History className="w-4 h-4" />
                          <h3 className="text-[10px] font-black uppercase tracking-widest">
                            Previous Archives
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {savedResumes.slice(0, 4).map((r, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setResumeText(r.text);
                                setStep(2);
                                toast.success("Using archived baseline");
                              }}
                              className="px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-left hover:border-primary/30 hover:bg-white transition-all flex items-center justify-between group/archive"
                            >
                              <div className="space-y-1">
                                <p className="text-xs font-black text-slate-700 truncate w-40">
                                  {r.fileName}
                                </p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase">
                                  {new Date(r.uploadedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-slate-200 group-hover/archive:text-primary transition-colors" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </motion.div>
            )}

            {/* Step 2: Targeting (JD Inputs) */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-8 space-y-8"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-1 w-12 bg-accent rounded-full"></div>
                  <h2 className="text-3xl font-display font-black uppercase tracking-tight">
                    Forge Parameters
                  </h2>
                </div>

                <div className="p-8 rounded-[32px] bg-slate-900 text-white shadow-2xl space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-[80px] -z-0" />
                  <div className="relative z-10">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3 mb-6">
                      <Cpu className="w-3.5 h-3.5 text-accent" />
                      Neural Engine Configuration
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                          Logic Provider
                        </label>
                        <div className="relative">
                          <select
                            value={provider}
                            onChange={(e) => {
                              setProvider(e.target.value);
                              if (e.target.value === "nvidia")
                                setModel(NVIDIA_MODELS[0]);
                              else setModel("");
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest p-3 appearance-none focus:ring-2 focus:ring-accent/50 outline-none transition-all"
                          >
                            {PROVIDERS.map((p) => (
                              <option
                                key={p}
                                value={p}
                                className="text-primary"
                              >
                                {p.toUpperCase()}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                        </div>
                      </div>

                      {(provider === "nvidia" || provider === "openrouter") && (
                        <div className="space-y-2.5">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            Model Index
                          </label>
                          {provider === "nvidia" ? (
                            <div className="relative">
                              <select
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest p-3 appearance-none focus:ring-2 focus:ring-accent/50 outline-none transition-all"
                              >
                                {NVIDIA_MODELS.map((m) => (
                                  <option
                                    key={m}
                                    value={m}
                                    className="text-primary"
                                  >
                                    {m.split("/").pop()?.toUpperCase()}
                                  </option>
                                ))}
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

                <div className="grid grid-cols-1 gap-8">
                  <section className="bg-white rounded-[40px] p-12 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-primary opacity-20" />
                    <div className="space-y-10">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <h2 className="text-4xl font-black tracking-tight leading-none text-slate-800">
                            Configure{" "}
                            <span className="text-primary italic">Target.</span>
                          </h2>
                          <p className="text-slate-500 text-sm font-medium">
                            Input job parameters for optimal AI alignment.
                          </p>
                        </div>
                        <button
                          onClick={() => setStep(1)}
                          className="p-3 rounded-full bg-slate-50 text-slate-400 hover:text-primary transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Target Designation (Job Title)
                          </label>
                          <input
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder="Senior Neural Systems Architect"
                            className="w-full px-8 py-5 rounded-[24px] bg-slate-50 border border-slate-100 focus:outline-none focus:border-primary/30 focus:bg-white transition-all font-bold text-slate-800"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Mission Parameters (Job Description)
                          </label>
                          <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the full job description here..."
                            className="w-full h-80 px-8 py-6 rounded-[24px] bg-slate-50 border border-slate-100 focus:outline-none focus:border-primary/30 focus:bg-white transition-all font-medium text-slate-600 leading-relaxed resize-none"
                          />
                        </div>

                        <button
                          onClick={generateCoverLetters}
                          disabled={generating || !jobTitle || !jobDescription}
                          className="w-full py-6 rounded-[24px] bg-primary text-white font-black uppercase tracking-[0.3em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-4"
                        >
                          {generating ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Synthesizing Variations...
                            </>
                          ) : (
                            <>
                              Commence Generation{" "}
                              <ArrowRight className="w-5 h-5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              </motion.div>
            )}

            {/* Step 3: Selection & Instant Preview */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="lg:col-span-12 space-y-10"
              >
                <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                  <div className="flex-1 bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-primary/5 text-primary">
                          <History className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">
                          Tactical Variants
                        </h3>
                      </div>
                      <button
                        onClick={() => setStep(2)}
                        className="px-4 py-2 rounded-xl border border-slate-100 text-slate-400 font-black text-[8px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Re-Calibrate
                      </button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                      {variations.map((v, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedIndex(i)}
                          className={`min-w-[160px] p-5 rounded-2xl border text-left transition-all relative group ${
                            selectedIndex === i
                              ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                              : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-primary/30"
                          }`}
                        >
                          <span
                            className={`text-[7px] font-black uppercase tracking-widest block mb-1.5 ${selectedIndex === i ? "text-white/50" : "text-slate-400"}`}
                          >
                            Mode {i + 1}
                          </span>
                          <p
                            className={`text-[10px] font-black uppercase tracking-widest ${selectedIndex === i ? "text-white" : "text-slate-800"}`}
                          >
                            {i === 0
                              ? "Standard"
                              : i === 1
                                ? "Visionary"
                                : i === 2
                                  ? "Direct"
                                  : i === 3
                                    ? "Strategic"
                                    : "Enthusiastic"}
                          </p>
                          {selectedIndex === i && (
                            <Check className="w-3 h-3 text-white absolute top-4 right-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={downloadPDF}
                    disabled={downloading}
                    className="lg:w-80 group relative overflow-hidden rounded-[40px] bg-primary text-white p-8 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary/20 flex flex-col items-center justify-center gap-3"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {downloading ? (
                      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <div className="p-4 rounded-2xl bg-white/10 group-hover:bg-white/20 transition-colors">
                          <Download className="w-8 h-8" />
                        </div>
                        <span className="font-black uppercase tracking-[0.2em] text-xs">
                          Forge & Download PDF
                        </span>
                      </>
                    )}
                  </button>
                </div>

                <div className="w-full">
                  <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-300/50 relative overflow-hidden min-h-[800px] flex flex-col border border-slate-100">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/creampaper.png')] opacity-[0.03] pointer-events-none" />
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between relative bg-white/80 backdrop-blur-md">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-900/10">
                          <FileSearch className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">
                            High-Fidelity Preview
                          </h4>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            Variation {selectedIndex + 1}:{" "}
                            {selectedIndex === 0
                              ? "Standard"
                              : selectedIndex === 1
                                ? "Visionary"
                                : selectedIndex === 2
                                  ? "Direct"
                                  : selectedIndex === 3
                                    ? "Strategic"
                                    : "Enthusiastic"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-[20mm] md:p-[25mm] flex-1 relative overflow-auto custom-scrollbar bg-[#f8fafc]/50">
                      <div className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] p-[15mm] md:p-[25mm] relative">
                        <motion.div
                          key={selectedIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-12"
                        >
                          {/* AI provides the header in its content */}
                          <div className="content text-slate-700 leading-relaxed font-medium whitespace-pre-wrap text-sm md:text-base">
                            {variations[selectedIndex]}
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Sidebar Info (only for Step 1 & 2) */}
          {step < 3 && (
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 rounded-[32px] p-8 text-white space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                  Intelligence Protocol
                </h3>
                <div className="space-y-4 relative">
                  {[
                    "Stateless high-concurrency generation",
                    "Local-only file processing",
                    "Stored baseline for instant access",
                    "Direct A4 PDF rendering",
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center mt-0.5">
                        <Check className="w-2 h-2 text-primary" />
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-[32px] p-8 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">
                  Status Monitor
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Memory Cluster</span>
                    <span className="text-green-500">OPTIMIZED</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
                      }}
                      className="bg-primary h-full"
                    />
                  </div>
                </div>
              </div>
            </aside>
          )}
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </Layout>
  );
}
