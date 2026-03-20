import type { Metadata } from "next";
import LandingPageContent from "@/components/LandingPageContent";

export const metadata: Metadata = {
  title: "Bulletproof AI Resume Builder | HIREPROOF",
  description:
    "Transform your career with surgical precision. HIREPROOF leverages multi-model AI architectures to build ATS-optimized resumes that secure interviews.",
  openGraph: {
    title: "HIREPROOF | AI-Powered Resume Intelligence",
    description:
      "Reconstruct your professional identity with surgical precision. Pass every ATS and secure the room.",
    url: "https://hireproof.ai",
    images: ["/og-image.png"],
  },
};

export default function Page() {
  return <LandingPageContent />;
}
