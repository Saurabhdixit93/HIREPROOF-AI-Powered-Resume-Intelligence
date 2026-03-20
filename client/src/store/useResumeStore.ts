import { create } from 'zustand';

interface ResumeData {
  _id: string;
  title: string;
  basics: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    summary?: string;
    website?: string;
    links: { label: string; url: string }[];
  };
  sections: {
    work: any[];
    education: any[];
    skills: any[];
    projects: any[];
    certifications: any[];
    languages: any[];
  };
  metadata: {
    templateId: string;
    layout: string[];
    theme: {
      primaryColor: string;
      fontFamily: string;
      fontSize: string;
    };
  };
}

interface ResumeStore {
  resume: ResumeData | null;
  setResume: (resume: ResumeData) => void;
  updateBasics: (basics: Partial<ResumeData['basics']>) => void;
  updateSections: (sections: Partial<ResumeData['sections']>) => void;
}

export const useResumeStore = create<ResumeStore>((set) => ({
  resume: null,
  setResume: (resume) => set({ resume }),
  updateBasics: (basics) => set((state) => ({
    resume: state.resume ? {
      ...state.resume,
      basics: { ...state.resume.basics, ...basics }
    } : null
  })),
  updateSections: (sections) => set((state) => ({
    resume: state.resume ? {
      ...state.resume,
      sections: { ...state.resume.sections, ...sections }
    } : null
  })),
}));
