"use client";

import { useResumeStore } from "@/store/useResumeStore";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Building2,
  Briefcase,
  GraduationCap,
  Cpu,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SectionEditor() {
  const { resume, updateSections } = useResumeStore();
  const [expandedSection, setExpandedSection] = useState<string | null>("work");

  if (!resume) return null;

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const addWork = () => {
    const newWork = [
      ...(resume.sections.work || []),
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        highlights: [],
        isCurrent: false,
      },
    ];
    updateSections({ work: newWork });
  };

  const addEducation = () => {
    const newEducation = [
      ...(resume.sections.education || []),
      { institution: "", area: "", studyType: "", startDate: "", endDate: "" },
    ];
    updateSections({ education: newEducation });
  };

  const addSkill = () => {
    const newSkills = [
      ...(resume.sections.skills || []),
      { name: "", keywords: [] },
    ];
    updateSections({ skills: newSkills });
  };

  const sectionIconStyle =
    "w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors";

  return (
    <div className="space-y-6">
      {/* Work Experience */}
      <div className="group border border-slate-100 rounded-[32px] overflow-hidden bg-white transition-all hover:border-slate-200">
        <button
          onClick={() => toggleSection("work")}
          className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
        >
          <div className="flex items-center gap-5">
            <div className={sectionIconStyle}>
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-display font-black text-xs uppercase tracking-[0.2em]">
                Work Experience
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {resume.sections.work?.length || 0} Operational Units
              </p>
            </div>
          </div>
          <div
            className={`p-2 rounded-lg transition-transform duration-300 ${expandedSection === "work" ? "rotate-180 bg-primary/5 text-primary" : "text-slate-300"}`}
          >
            <ChevronDown className="w-5 h-5" />
          </div>
        </button>

        <AnimatePresence>
          {expandedSection === "work" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-8 pb-10 space-y-10">
                {resume.sections.work?.map((work: any, index: number) => (
                  <div
                    key={index}
                    className="p-8 rounded-[24px] bg-slate-50/50 border border-slate-100 group/item relative"
                  >
                    <button
                      onClick={() => {
                        const updated = resume.sections.work.filter(
                          (_: any, i: number) => i !== index,
                        );
                        updateSections({ work: updated });
                      }}
                      className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">
                          Organization
                        </label>
                        <input
                          className="w-full text-sm font-bold border-b border-slate-200 hover:border-slate-300 focus:border-primary bg-transparent outline-none transition-all pb-2"
                          placeholder="Quantum Dynamics"
                          value={work.company || ""}
                          onChange={(e) => {
                            const updated = [...resume.sections.work];
                            updated[index] = {
                              ...work,
                              company: e.target.value,
                            };
                            updateSections({ work: updated });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">
                          Assignment Role
                        </label>
                        <input
                          className="w-full text-sm font-bold border-b border-slate-200 hover:border-slate-300 focus:border-primary bg-transparent outline-none transition-all pb-2"
                          placeholder="Lead Systems Architect"
                          value={work.position || ""}
                          onChange={(e) => {
                            const updated = [...resume.sections.work];
                            updated[index] = {
                              ...work,
                              position: e.target.value,
                            };
                            updateSections({ work: updated });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">
                          Start Date
                        </label>
                        <input
                          className="w-full text-sm font-bold border-b border-slate-200 hover:border-slate-300 focus:border-primary bg-transparent outline-none transition-all pb-2"
                          placeholder="Jan 2022"
                          value={work.startDate || ""}
                          onChange={(e) => {
                            const updated = [...resume.sections.work];
                            updated[index] = {
                              ...work,
                              startDate: e.target.value,
                            };
                            updateSections({ work: updated });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">
                          End Date
                        </label>
                        <input
                          className="w-full text-sm font-bold border-b border-slate-200 hover:border-slate-300 focus:border-primary bg-transparent outline-none transition-all pb-2"
                          placeholder="Present"
                          value={work.endDate || ""}
                          onChange={(e) => {
                            const updated = [...resume.sections.work];
                            updated[index] = {
                              ...work,
                              endDate: e.target.value,
                            };
                            updateSections({ work: updated });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addWork}
                  className="w-full py-5 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Deploy New Unit
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Education */}
      <div className="group border border-slate-100 rounded-[32px] overflow-hidden bg-white transition-all hover:border-slate-200">
        <button
          onClick={() => toggleSection("education")}
          className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
        >
          <div className="flex items-center gap-5">
            <div className={sectionIconStyle}>
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-display font-black text-xs uppercase tracking-[0.2em]">
                Knowledge Center
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {resume.sections.education?.length || 0} Credentials
              </p>
            </div>
          </div>
          <div
            className={`p-2 rounded-lg transition-transform duration-300 ${expandedSection === "education" ? "rotate-180 bg-primary/5 text-primary" : "text-slate-300"}`}
          >
            <ChevronDown className="w-5 h-5" />
          </div>
        </button>

        <AnimatePresence>
          {expandedSection === "education" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-8 pb-10 space-y-10">
                {resume.sections.education?.map((edu: any, index: number) => (
                  <div
                    key={index}
                    className="p-8 rounded-[24px] bg-slate-50/50 border border-slate-100 group/item relative"
                  >
                    <button
                      onClick={() => {
                        const updated = resume.sections.education.filter(
                          (_: any, i: number) => i !== index,
                        );
                        updateSections({ education: updated });
                      }}
                      className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="col-span-2 space-y-2">
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">
                          Institution
                        </label>
                        <input
                          className="w-full text-sm font-bold border-b border-slate-200 hover:border-slate-300 focus:border-primary bg-transparent outline-none transition-all pb-2"
                          placeholder="Institute of Advanced Theory"
                          value={edu.institution || ""}
                          onChange={(e) => {
                            const updated = [...resume.sections.education];
                            updated[index] = {
                              ...edu,
                              institution: e.target.value,
                            };
                            updateSections({ education: updated });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">
                          Accreditation
                        </label>
                        <input
                          className="w-full text-sm font-bold border-b border-slate-200 hover:border-slate-300 focus:border-primary bg-transparent outline-none transition-all pb-2"
                          placeholder="Master of Intelligence"
                          value={edu.studyType || ""}
                          onChange={(e) => {
                            const updated = [...resume.sections.education];
                            updated[index] = {
                              ...edu,
                              studyType: e.target.value,
                            };
                            updateSections({ education: updated });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">
                          Start Date
                        </label>
                        <input
                          className="w-full text-sm font-bold border-b border-slate-200 hover:border-slate-300 focus:border-primary bg-transparent outline-none transition-all pb-2"
                          placeholder="Sep 2018"
                          value={edu.startDate || ""}
                          onChange={(e) => {
                            const updated = [...resume.sections.education];
                            updated[index] = {
                              ...edu,
                              startDate: e.target.value,
                            };
                            updateSections({ education: updated });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">
                          End Date
                        </label>
                        <input
                          className="w-full text-sm font-bold border-b border-slate-200 hover:border-slate-300 focus:border-primary bg-transparent outline-none transition-all pb-2"
                          placeholder="Jun 2022"
                          value={edu.endDate || ""}
                          onChange={(e) => {
                            const updated = [...resume.sections.education];
                            updated[index] = {
                              ...edu,
                              endDate: e.target.value,
                            };
                            updateSections({ education: updated });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addEducation}
                  className="w-full py-5 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Append Credential
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skills */}
      <div className="group border border-slate-100 rounded-[32px] overflow-hidden bg-white transition-all hover:border-slate-200">
        <button
          onClick={() => toggleSection("skills")}
          className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
        >
          <div className="flex items-center gap-5">
            <div className={sectionIconStyle}>
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-display font-black text-xs uppercase tracking-[0.2em]">
                Core Assets
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {resume.sections.skills?.length || 0} Specializations
              </p>
            </div>
          </div>
          <div
            className={`p-2 rounded-lg transition-transform duration-300 ${expandedSection === "skills" ? "rotate-180 bg-primary/5 text-primary" : "text-slate-300"}`}
          >
            <ChevronDown className="w-5 h-5" />
          </div>
        </button>

        <AnimatePresence>
          {expandedSection === "skills" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-8 pb-10 space-y-6">
                <div className="flex flex-wrap gap-3">
                  {resume.sections.skills?.map((skill: any, index: number) => (
                    <motion.div
                      key={index}
                      layout
                      className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 group/skill"
                    >
                      <input
                        className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest w-24"
                        value={skill.name}
                        placeholder="NEURAL_NETS"
                        onChange={(e) => {
                          const updated = [...resume.sections.skills];
                          updated[index] = { ...skill, name: e.target.value };
                          updateSections({ skills: updated });
                        }}
                      />
                      <button
                        onClick={() => {
                          const updated = resume.sections.skills.filter(
                            (_: any, i: number) => i !== index,
                          );
                          updateSections({ skills: updated });
                        }}
                        className="p-0.5 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                  <button
                    onClick={addSkill}
                    className="px-5 py-2.5 rounded-2xl border-2 border-dashed border-slate-100 flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Index Skill
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
