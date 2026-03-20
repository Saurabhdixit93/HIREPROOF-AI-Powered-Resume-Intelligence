"use client";

import { useSession } from "next-auth/react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { CreateResumeModal } from "./CreateResumeModal";
import { useUIStore } from "@/store/useUIStore";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { status } = useSession();
  const { isCreateModalOpen, closeCreateModal } = useUIStore();

  // Middleware handles redirects — we just show a loader while session resolves
  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-100 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <CreateResumeModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
      />
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
