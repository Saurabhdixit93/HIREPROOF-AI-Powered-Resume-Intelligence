"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { toast } from "sonner";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import React from "react"; // Added to fix React.createElement error

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

interface NotificationData {
  title: string;
  message: string;
  type: "success" | "info" | "error";
  action?: string;
  jobId?: string;
}

interface CustomSession extends Session {
  accessToken?: string;
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const { data } = useSession();
  const session = data as CustomSession | null;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only connect if the user is logged in and has a token
    if (!session?.accessToken) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Connect to the backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
    
    const socketInstance = io(backendUrl, {
      auth: {
        token: session.accessToken,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("[Socket.io] Connected to server");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("[Socket.io] Disconnected from server");
      setIsConnected(false);
    });

    // Listen for systemic notifications
    socketInstance.on("notification", (data: NotificationData) => {
      const getIcon = () => {
        switch (data.type) {
          case "success": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
          case "error": return <XCircle className="w-5 h-5 text-red-500" />;
          default: return <Info className="w-5 h-5 text-blue-500" />;
        }
      };

      toast(data.title, {
        description: data.message,
        icon: getIcon(),
        className: "glass border-slate-100",
        action: data.action ? {
          label: data.action,
          onClick: () => console.log(`Action clicked: ${data.action}`),
        } : undefined,
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [session?.accessToken]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
