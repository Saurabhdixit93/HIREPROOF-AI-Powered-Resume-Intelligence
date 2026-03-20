"use client";

import { useSession, signOut } from "next-auth/react";
import {
  LogOut,
  Bell,
  CheckCircle2,
  XCircle,
  Info,
  Check,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  NotificationService,
  INotification,
} from "@/services/NotificationService";
import { useSocket } from "@/providers/SocketProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";

export function Navbar() {
  const { data: session } = useSession();
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      console.log("📡 API FETCH: Notifications (Triggered)");
      const res = await NotificationService.getNotifications();
      return {
        notifications: res.notifications || [],
        unreadCount: res.unreadCount || 0,
      };
    },
    enabled: !!session?.user,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const notifications: INotification[] = data?.notifications || [];
  const unreadCount: number = data?.unreadCount || 0;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Listen to socket for new notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notifData: any) => {
      const newNotif: INotification = {
        _id: notifData.id || Math.random().toString(),
        userId: "",
        title: notifData.title,
        message: notifData.message,
        type: notifData.type || "info",
        action: notifData.action,
        actionUrl: notifData.actionUrl,
        jobId: notifData.jobId,
        read: false,
        createdAt: notifData.createdAt || new Date().toISOString(),
      };

      queryClient.setQueryData(["notifications"], (old: any) => {
        if (!old) return { notifications: [newNotif], unreadCount: 1 };
        return {
          notifications: [newNotif, ...(old.notifications || [])],
          unreadCount: (old.unreadCount || 0) + 1,
        };
      });

      // Professional Toast Feedback
      toast(notifData.title, {
        description: notifData.message,
        action: notifData.actionUrl
          ? {
              label: notifData.action || "Open",
              onClick: () => window.open(notifData.actionUrl, "_blank"),
            }
          : undefined,
        duration: 8000,
      });
    };

    socket.on("notification", handleNewNotification);
    return () => {
      socket.off("notification", handleNewNotification);
    };
  }, [socket, queryClient]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Optimistic update
    queryClient.setQueryData(["notifications"], (old: any) => {
      if (!old) return old;
      return {
        notifications: old.notifications.map((n: INotification) =>
          n._id === id ? { ...n, read: true } : n,
        ),
        unreadCount: Math.max(0, old.unreadCount - 1),
      };
    });

    try {
      await NotificationService.markAsRead(id);
    } catch (err) {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  };

  const handleMarkAllAsRead = async () => {
    queryClient.setQueryData(["notifications"], (old: any) => {
      if (!old) return old;
      return {
        notifications: old.notifications.map((n: INotification) => ({
          ...n,
          read: true,
        })),
        unreadCount: 0,
      };
    });

    try {
      await NotificationService.markAllAsRead();
    } catch (err) {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <nav className="h-20 border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50 px-8 flex items-center justify-between">
      <Link href="/dashboard" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/10">
          <span className="text-white font-black text-xl">H</span>
        </div>
        <span className="font-display font-black text-2xl tracking-tighter text-primary">
          HIREPROOF
        </span>
      </Link>

      <div className="flex items-center gap-6">
        {/* Notifications Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2.5 hover:bg-slate-50 rounded-xl transition-all relative group"
          >
            <Bell className="w-5.5 h-5.5 text-slate-400 group-hover:text-primary transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white shadow-sm shadow-accent/40"></span>
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-primary">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs font-semibold text-accent hover:text-accent/80 transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    No notifications yet.
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map((notif) => (
                      <div
                        key={notif._id}
                        className={`p-4 border-b border-slate-50 flex gap-3 items-start transition-colors ${notif.read ? "bg-white opacity-60" : "bg-blue-50/20"}`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {getIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-primary mb-0.5 leading-tight">
                            {notif.title}
                          </p>
                          <p className="text-xs text-slate-600 line-clamp-2 mb-1.5 leading-relaxed">
                            {notif.message}
                          </p>
                          {notif.action && notif.actionUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(notif.actionUrl, "_blank");
                              }}
                              className="text-[10px] uppercase tracking-widest font-black text-accent hover:text-primary transition-colors mb-2 block"
                            >
                              {notif.action} →
                            </button>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              {new Date(notif.createdAt).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </span>
                            {!notif.read && (
                              <button
                                onClick={(e) => handleMarkAsRead(notif._id, e)}
                                className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm"
                              >
                                <Check className="w-3 h-3" />
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-[1px] bg-slate-100"></div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
              Authenticated
            </span>
            <span className="text-xs font-bold text-primary leading-none uppercase">
              {session?.user?.email}
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all group"
          >
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
    </nav>
  );
}
