import { apiClient } from "@/lib/apiClient";

export const AIService = {
  generateSummary: async (resumeData: any, preferredProvider?: string, model?: string) => {
    return apiClient.post("/ai/generate-summary", { resumeData, preferredProvider, model });
  },
  improveBullets: async (bullets: string[], preferredProvider?: string, model?: string) => {
    return apiClient.post("/ai/improve-bullets", { bullets, preferredProvider, model });
  },
  analyzeJD: async (jobDescription: string) => {
    return apiClient.post("/ai/analyze-jd", { jobDescription });
  },
  tailorResume: async (resumeId: string, jobDescription: string) => {
    return apiClient.post("/ai/tailor-resume", { resumeId, jobDescription });
  }
};
