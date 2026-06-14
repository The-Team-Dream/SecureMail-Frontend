"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { mailboxApi } from "@/APIs/features/mailboxes";
import {
  SocketEvent,
  type NewEmailEvent,
  type EmailScannedEvent,
  type NewNotificationEvent,
  type MailboxSyncCompleteEvent,
  type MailboxSyncFailedEvent,
  type SecurityAlertEvent,
  type MailboxStatusEvent,
  type EmailSentEvent,
} from "@/APIs/types/WebSocket";

// ─── Context ─────────────────────────────────────────────────────────────────

interface SocketContextValue {
  /** The Socket.IO instance (null before auth) */
  socket: Socket | null;
  /** Whether the socket is currently connected */
  isConnected: boolean;
  /** Connection error message, if any */
  connectionError: string | null;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  connectionError: null,
});

export const useSocketContext = () => useContext(SocketContext);

// ─── Provider ────────────────────────────────────────────────────────────────

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Throttled mailbox sync to prevent recursive/concurrent duplicate syncs within 10 seconds
  const lastSyncTimeRef = useRef<Record<number, number>>({});
  const triggerSync = useCallback((mailboxId: number) => {
    const now = Date.now();
    const lastSync = lastSyncTimeRef.current[mailboxId] || 0;
    if (now - lastSync < 10000) {
      console.log(
        `[WebSocket] Sync for mailbox ${mailboxId} throttled (last sync was ${now - lastSync}ms ago)`,
      );
      return;
    }
    lastSyncTimeRef.current[mailboxId] = now;
    console.log(`[WebSocket] Triggering auto-sync for mailbox ${mailboxId}`);
    mailboxApi.syncMailbox(mailboxId).catch((err) => {
      console.error(`[WebSocket] Error syncing mailbox ${mailboxId}:`, err);
    });
  }, []);

  // ── Event Handlers ───────────────────────────────────────────────────────

  const handleNewEmail = useCallback(
    (data: any) => {
      console.log("[WebSocket] handleNewEmail received event payload:", data);
      const mailboxId =
        data?.mailboxId ??
        data?.mailBoxId ??
        data?.email?.mailboxId ??
        data?.email?.mailBoxId;
      console.log("[WebSocket] handleNewEmail extracted mailboxId:", mailboxId);

      if (!mailboxId) {
        console.warn(
          "[WebSocket] handleNewEmail: No mailboxId found in event data!",
        );
        // We'll still invalidate all emails queries as a safety fallback
        queryClient.invalidateQueries({ queryKey: ["emails"] });
        queryClient.refetchQueries({ queryKey: ["emails"] });
      } else {
        const idStr = String(mailboxId);
        const idNum = Number(mailboxId);

        // Invalidate and refetch email lists for this mailbox (support both string/number keys)
        queryClient.invalidateQueries({ queryKey: ["emails", idStr] });
        queryClient.invalidateQueries({ queryKey: ["emails", idNum] });
        queryClient.refetchQueries({ queryKey: ["emails", idStr] });
        queryClient.refetchQueries({ queryKey: ["emails", idNum] });

        // Force root key invalidation as well so any active view (e.g., FolderClient / inbox list) updates
        queryClient.invalidateQueries({ queryKey: ["emails"] });
      }

      // Invalidate and refetch mailboxes list
      queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
      queryClient.refetchQueries({ queryKey: ["mailboxes"] });

      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.refetchQueries({ queryKey: ["notifications"] });

      // Invalidate and refetch unread counts
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
      queryClient.refetchQueries({
        queryKey: ["notifications", "unread-count"],
      });

      // Invalidate and refetch analytics (new email changes stats)
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      if (mailboxId) {
        const idStr = String(mailboxId);
        const idNum = Number(mailboxId);
        queryClient.refetchQueries({
          queryKey: ["analytics", "mailbox", idStr],
        });
        queryClient.refetchQueries({
          queryKey: ["analytics", "mailbox", idNum],
        });

        // Trigger automatic mailbox sync with the mail provider on new email notification
        triggerSync(idNum);
      }

      toast.info("📩 New email received", {
        description: data.email?.subject || "You have a new email",
        duration: 4000,
      });
    },
    [queryClient, triggerSync],
  );

  const handleEmailSent = useCallback(
    (data: any) => {
      console.log("[WebSocket] handleEmailSent payload:", data);
      const mailboxId = data?.mailboxId ?? data?.mailBoxId;

      if (mailboxId) {
        // Invalidate broad key first (marks all sub-keys stale)
        queryClient.invalidateQueries({
          queryKey: ["emails", String(mailboxId)],
        });

        // Actively refetch the sent folder so the new email appears immediately
        // without the user needing to manually refresh the page.
        queryClient.refetchQueries({
          queryKey: ["emails", String(mailboxId), "sent"],
        });
      } else {
        // Fallback: invalidate all email queries if mailboxId is missing
        queryClient.invalidateQueries({
          queryKey: ["emails"],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["analytics"],
      });
    },
    [queryClient],
  );

  const handleEmailScanned = useCallback(
    (data: any) => {
      const mailboxId =
        data.mailboxId ??
        data.mailBoxId ??
        data.email?.mailboxId ??
        data.email?.mailBoxId;
      const emailId = data.emailId ?? data.id ?? data.email?.id;
      const securityVerdict = data.securityVerdict ?? data.verdict;

      if (mailboxId) {
        const idStr = String(mailboxId);
        const idNum = Number(mailboxId);

        // Refresh and refetch the email list to show updated verdict
        queryClient.invalidateQueries({ queryKey: ["emails", idStr] });
        queryClient.invalidateQueries({ queryKey: ["emails", idNum] });
        queryClient.refetchQueries({ queryKey: ["emails", idStr] });
        queryClient.refetchQueries({ queryKey: ["emails", idNum] });

        // Refresh and refetch analytics for updated threat stats
        queryClient.invalidateQueries({ queryKey: ["analytics"] });
        queryClient.refetchQueries({
          queryKey: ["analytics", "mailbox", idStr],
        });
        queryClient.refetchQueries({
          queryKey: ["analytics", "mailbox", idNum],
        });

        // Refresh and refetch mailboxes list
        queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
        queryClient.refetchQueries({ queryKey: ["mailboxes"] });

        // Refresh and refetch security reports
        queryClient.invalidateQueries({
          queryKey: ["mailboxes", "reports", idStr],
        });
        queryClient.invalidateQueries({
          queryKey: ["mailboxes", "reports", idNum],
        });
        queryClient.refetchQueries({
          queryKey: ["mailboxes", "reports", idStr],
        });
        queryClient.refetchQueries({
          queryKey: ["mailboxes", "reports", idNum],
        });
      }

      if (emailId) {
        const idStr = String(emailId);
        const idNum = Number(emailId);

        // Refresh and refetch specific email details if open
        queryClient.invalidateQueries({ queryKey: ["email", idStr] });
        queryClient.invalidateQueries({ queryKey: ["email", idNum] });
        queryClient.refetchQueries({ queryKey: ["email", idStr] });
        queryClient.refetchQueries({ queryKey: ["email", idNum] });
      }

      if (
        securityVerdict &&
        securityVerdict !== "SAFE" &&
        securityVerdict !== "clean"
      ) {
        toast.warning("⚠️ Threat Detected", {
          description: `Email flagged as ${securityVerdict}`,
          duration: 6000,
        });
      }
    },
    [queryClient],
  );

  const handleNewNotification = useCallback(
    (data: any) => {
      // Invalidate the notifications list
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      queryClient.refetchQueries({
        queryKey: ["notifications"],
      });

      // Invalidate unread count
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
      queryClient.refetchQueries({
        queryKey: ["notifications", "unread-count"],
      });

      const notification = data?.notification ?? data;
      if (notification) {
        const isSecurityAlert =
          notification.type === "NEW_LOGIN_DETECTED" ||
          notification.metadata?.verdict === "PHISHING" ||
          notification.metadata?.verdict === "SPAM";

        if (isSecurityAlert) {
          toast.error("🔒 Security Alert", {
            description: notification.title || notification.message,
            duration: 8000,
          });
        } else {
          toast.info("🔔 New Notification", {
            description: notification.title || notification.message,
            duration: 4000,
          });
        }

        // Trigger automatic mailbox sync on receiving a new email notification
        const mId =
          notification.mailBoxId ??
          notification.mailboxId ??
          notification.metadata?.mailboxId ??
          notification.metadata?.mailBoxId;
        if (notification.type === "NEW_EMAIL_RECEIVED" && mId) {
          triggerSync(Number(mId));
        }
      }
    },
    [queryClient, triggerSync],
  );

  const handleMailboxSyncComplete = useCallback(
    (data: any) => {
      const mailboxId = data.mailboxId ?? data.mailBoxId;
      const success = data.success !== false;

      // Refresh mailbox list
      queryClient.invalidateQueries({
        queryKey: ["mailboxes"],
      });

      // Refresh specific mailbox
      queryClient.invalidateQueries({
        queryKey: ["mailboxes", String(mailboxId)],
      });

      // Refresh emails for this mailbox
      queryClient.invalidateQueries({
        queryKey: ["emails", String(mailboxId)],
      });

      // Refresh analytics
      queryClient.invalidateQueries({
        queryKey: ["analytics"],
      });

      if (!success) {
        toast.error("❌ Sync Failed", {
          description: "Mailbox synchronization failed",
          duration: 6000,
        });
      }
    },
    [queryClient],
  );

  const handleMailboxSyncFailed = useCallback(
    (data: any) => {
      // Refresh mailbox to show error state
      queryClient.invalidateQueries({
        queryKey: ["mailboxes"],
      });

      toast.error("❌ Sync Failed", {
        description: data.error || "Mailbox synchronization failed",
        duration: 6000,
      });
    },
    [queryClient],
  );

  const handleSecurityAlert = useCallback(
    (data: SecurityAlertEvent) => {
      // Refresh notifications & analytics
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
      queryClient.invalidateQueries({
        queryKey: ["analytics"],
      });

      const toastFn =
        data.severity === "critical" || data.severity === "high"
          ? toast.error
          : toast.warning;

      toastFn(`🛡️ ${data.title}`, {
        description: data.message,
        duration: 8000,
      });
    },
    [queryClient],
  );

  const handleMailboxStatus = useCallback(
    (data: MailboxStatusEvent) => {
      queryClient.invalidateQueries({
        queryKey: ["mailboxes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["mailboxes", String(data.mailboxId)],
      });

      if (data.status === "error") {
        toast.error("Mailbox Error", {
          description:
            data.message || "There was an issue with your mailbox connection",
          duration: 6000,
        });
      }
    },
    [queryClient],
  );

  // ── Connection Lifecycle ────────────────────────────────────────────────

  useEffect(() => {
    const token = Cookies.get("token");

    // Don't connect if not authenticated
    if (!token) {
      disconnectSocket();
      setIsConnected(false);
      socketRef.current = null;
      return;
    }

    const socket = getSocket();
    socketRef.current = socket;

    // --- Connection Events ---
    const onConnect = () => {
      setIsConnected(true);
      setConnectionError(null);
      console.log("[WebSocket] Connected:", socket.id);
    };

    const onDisconnect = (reason: string) => {
      setIsConnected(false);
      console.log("[WebSocket] Disconnected:", reason);
    };

    const onConnectError = (error: Error) => {
      setIsConnected(false);
      setConnectionError(error.message);
      console.error("[WebSocket] Connection error:", error.message);
    };

    // Register connection listeners
    socket.on(SocketEvent.CONNECT, onConnect);
    socket.on(SocketEvent.DISCONNECT, onDisconnect);
    socket.on(SocketEvent.CONNECT_ERROR, onConnectError);

    const handleEmailReclassified = (reclassData: any) => {
      console.log(
        "[WebSocket] email_reclassified received event:",
        reclassData,
      );
      const mId =
        reclassData?.mailboxId ??
        reclassData?.mailBoxId ??
        reclassData?.email?.mailboxId ??
        reclassData?.email?.mailBoxId;
      const eId =
        reclassData?.emailId ?? reclassData?.id ?? reclassData?.email?.id;

      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: ["mailboxes"] });

      if (mId) {
        const idStr = String(mId);
        const idNum = Number(mId);

        queryClient.invalidateQueries({ queryKey: ["emails", idStr] });
        queryClient.invalidateQueries({ queryKey: ["emails", idNum] });
        queryClient.refetchQueries({ queryKey: ["emails", idStr] });
        queryClient.refetchQueries({ queryKey: ["emails", idNum] });

        queryClient.refetchQueries({
          queryKey: ["analytics", "mailbox", idStr],
        });
        queryClient.refetchQueries({
          queryKey: ["analytics", "mailbox", idNum],
        });

        queryClient.invalidateQueries({
          queryKey: ["mailboxes", "reports", idStr],
        });
        queryClient.invalidateQueries({
          queryKey: ["mailboxes", "reports", idNum],
        });
        queryClient.refetchQueries({
          queryKey: ["mailboxes", "reports", idStr],
        });
        queryClient.refetchQueries({
          queryKey: ["mailboxes", "reports", idNum],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["emails"] });
      }

      if (eId) {
        const idStr = String(eId);
        const idNum = Number(eId);
        queryClient.invalidateQueries({ queryKey: ["email", idStr] });
        queryClient.invalidateQueries({ queryKey: ["email", idNum] });
        queryClient.refetchQueries({ queryKey: ["email", idStr] });
        queryClient.refetchQueries({ queryKey: ["email", idNum] });
      }
    };

    // Register domain event listeners
    socket.on(SocketEvent.NEW_EMAIL, handleNewEmail);
    socket.on("new_email_arrived", handleNewEmail);
    socket.on("new_email", handleNewEmail);
    socket.on("email_arrived", handleNewEmail);
    socket.on(SocketEvent.EMAIL_SENT, handleEmailSent);
    socket.on(SocketEvent.EMAIL_SCANNED, handleEmailScanned);
    socket.on("email_reclassified", handleEmailReclassified);
    socket.on("email-reclassified", handleEmailReclassified);
    socket.on(SocketEvent.NEW_NOTIFICATION, handleNewNotification);
    socket.on(SocketEvent.MAILBOX_SYNC_COMPLETE, handleMailboxSyncComplete);
    socket.on(SocketEvent.MAILBOX_SYNC_FAILED, handleMailboxSyncFailed);
    socket.on(SocketEvent.SECURITY_ALERT, handleSecurityAlert);
    socket.on(SocketEvent.MAILBOX_STATUS, handleMailboxStatus);

    // If already connected (e.g. singleton was reused), set state immediately
    if (socket.connected) {
      setIsConnected(true);
    }

    // Cleanup on unmount
    return () => {
      socket.off(SocketEvent.CONNECT, onConnect);
      socket.off(SocketEvent.DISCONNECT, onDisconnect);
      socket.off(SocketEvent.CONNECT_ERROR, onConnectError);
      socket.off(SocketEvent.NEW_EMAIL, handleNewEmail);
      socket.off("new_email_arrived", handleNewEmail);
      socket.off("new_email", handleNewEmail);
      socket.off("email_arrived", handleNewEmail);
      socket.off(SocketEvent.EMAIL_SENT, handleEmailSent);
      socket.off(SocketEvent.EMAIL_SCANNED, handleEmailScanned);
      socket.off("email_reclassified", handleEmailReclassified);
      socket.off("email-reclassified", handleEmailReclassified);
      socket.off(SocketEvent.NEW_NOTIFICATION, handleNewNotification);
      socket.off(SocketEvent.MAILBOX_SYNC_COMPLETE, handleMailboxSyncComplete);
      socket.off(SocketEvent.MAILBOX_SYNC_FAILED, handleMailboxSyncFailed);
      socket.off(SocketEvent.SECURITY_ALERT, handleSecurityAlert);
      socket.off(SocketEvent.MAILBOX_STATUS, handleMailboxStatus);
    };
  }, [
    handleNewEmail,
    handleEmailSent,
    handleEmailScanned,
    handleNewNotification,
    handleMailboxSyncComplete,
    handleMailboxSyncFailed,
    handleSecurityAlert,
    handleMailboxStatus,
  ]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        connectionError,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
