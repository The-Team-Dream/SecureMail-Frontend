"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSocket } from "@/utils/providers/SocketProvider";
import { useNotificationStore } from "@/stores/useNotificationStore";

/**
 * Enhanced payload interfaces for notifications and navigation.
 */
interface NewEmailPayload {
  id: string;
  subject: string;
  fromName: string;
  mailboxId: string | number;
  folder: string;
}

interface SecurityAlertPayload {
  id: string;
  message: string;
  type: string;
  severity: "low" | "medium" | "high";
  mailboxId: string | number;
}

/**
 * Custom hook for real-time notifications and system alerts.
 * Features: Interactive toasts, Navigation, Audio feedback, and History storage.
 */
export const useSocketEvents = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // --- Utility: Notification Sound ---
    const playSound = () => {
      try {
        const audio = new Audio(
          "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3",
        );
        audio.volume = 0.5;
        audio.play().catch(() => {}); // Catch browser block
      } catch (e) {}
    };

    // --- 1. Handle New Email ---
    const handleNewEmail = (payload: NewEmailPayload) => {
      console.log("📬 New Email:", payload);

      // Save to Zustand store
      addNotification({
        id: payload.id,
        type: "new_email",
        title: `Email from ${payload.fromName}`,
        message: payload.subject,
        metadata: payload,
      });

      playSound();

      // Interactive Toast
      toast.success(
        (t) => (
          <div
            className="cursor-pointer flex flex-col"
            onClick={() => {
              router.push(
                `/mailboxes/${payload.mailboxId}/${payload.folder}/${payload.id}`,
              );
              toast.dismiss(t.id);
            }}
          >
            <span className="font-bold text-sm">
              New Email: {payload.fromName}
            </span>
            <span className="text-xs opacity-80 truncate max-w-[200px]">
              {payload.subject}
            </span>
          </div>
        ),
        { duration: 6000 },
      );

      // Refresh data
      if (payload.folder === "inbox") {
        queryClient.invalidateQueries({
          queryKey: ["emails", payload.mailboxId.toString(), "inbox"],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["unread-count", payload.mailboxId.toString()],
      });
    };

    // --- 2. Handle Security Alert ---
    const handleSecurityAlert = (payload: SecurityAlertPayload) => {
      console.warn("🚨 Security Alert:", payload);

      addNotification({
        id: payload.id || Math.random().toString(),
        type: "security_alert",
        title: "Security Threat Detected",
        message: payload.message,
        metadata: payload,
      });

      // High-priority interactive error toast
      toast.error(
        (t) => (
          <div
            className="cursor-pointer"
            onClick={() => {
              router.push(`/mailboxes/${payload.mailboxId}/security-reports`);
              toast.dismiss(t.id);
            }}
          >
            <span className="font-bold block">
              🚨 Phishing Attempt Detected!
            </span>
            <span className="text-xs">{payload.message}</span>
            <span className="block mt-1 text-[10px] underline">
              View Security Report
            </span>
          </div>
        ),
        { duration: 8000, position: "top-right" },
      );
    };

    // Attach listeners
    socket.on("new_email", handleNewEmail);
    socket.on("security_alert", handleSecurityAlert);

    // --- Clean Up ---
    return () => {
      socket.off("new_email", handleNewEmail);
      socket.off("security_alert", handleSecurityAlert);
    };
  }, [socket, isConnected, queryClient, router, addNotification]);

  return { isConnected };
};
