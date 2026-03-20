"use client";

import { Layout } from "@/components/Layout";
import { Settings, User, Bell, Shield, Palette, Globe, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState(true);

  return (
    <Layout>
      <div className="mb-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 mb-6">
          <div className="h-[2px] w-12 bg-accent" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">System Configuration</span>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-primary leading-tight uppercase">Settings</h1>
      </div>

      <div className="space-y-8 max-w-3xl">
        {/* Profile Section */}
        <div className="glass rounded-[32px] p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-black text-lg uppercase tracking-tight">Profile</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between py-4 border-b border-slate-50">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Name</p>
                <p className="font-bold text-primary">{session?.user?.name || "—"}</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-slate-50">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email</p>
                <p className="font-bold text-primary">{session?.user?.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Session</p>
                <p className="font-bold text-accent text-sm">Active — NextAuth JWT</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="glass rounded-[32px] p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-accent/10">
              <Bell className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-black text-lg uppercase tracking-tight">Preferences</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between py-4 border-b border-slate-50">
              <div>
                <p className="font-bold text-sm">Email Notifications</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">Receive updates on AI optimization completion</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-7 rounded-full transition-all relative ${notifications ? "bg-accent" : "bg-slate-200"}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-1 transition-all ${notifications ? "left-6" : "left-1"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-slate-50">
              <div>
                <p className="font-bold text-sm">Default AI Provider</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">Provider used when creating new resumes</p>
              </div>
              <span className="px-4 py-2 rounded-xl bg-slate-50 text-[10px] font-black uppercase tracking-widest text-primary">OpenAI</span>
            </div>

            <div className="flex items-center justify-between py-4">
              <div>
                <p className="font-bold text-sm">Theme</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">Visual appearance of the platform</p>
              </div>
              <span className="px-4 py-2 rounded-xl bg-slate-50 text-[10px] font-black uppercase tracking-widest text-primary">Light</span>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="glass rounded-[32px] p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-red-50">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-black text-lg uppercase tracking-tight">Security</h3>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group">
              <span className="font-bold text-sm">Change Password</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">Update →</span>
            </button>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-50 transition-all group"
            >
              <span className="font-bold text-sm text-red-500 flex items-center gap-3">
                <LogOut className="w-4 h-4" /> Sign Out
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400">End Session</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
