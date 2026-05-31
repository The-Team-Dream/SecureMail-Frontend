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
import { toast } from "sonner";
import { Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { getSocket, disconnectSocket } from "@/lib/socket";
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
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // ── Event Handlers ───────────────────────────────────────────────────────

  const handleNewEmail = useCallback(
    (data: NewEmailEvent) => {
      const { mailboxId } = data;

      // Invalidate email lists for this mailbox
      queryClient.invalidateQueries({
        queryKey: ["emails", String(mailboxId)],
      });

      // Invalidate notifications
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      // Invalidate unread counts
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });

      // Invalidate analytics (new email changes stats)
      queryClient.invalidateQueries({
        queryKey: ["analytics"],
      });

      toast.info("📩 New email received", {
        description: data.email?.subject || "You have a new email",
        duration: 4000,
      });
    },
    [queryClient],
  );

  const handleEmailSent = useCallback(
    (data: EmailSentEvent) => {
      const { mailboxId } = data || {};
      
      if (mailboxId) {
        queryClient.invalidateQueries({
          queryKey: ["emails", String(mailboxId)],
        });
      } else {
        // Fallback if backend payload differs
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
      const mailboxId = data.mailboxId ?? data.mailBoxId;
      const emailId = data.emailId;
      const securityVerdict = data.securityVerdict ?? data.verdict;

      // Refresh the email list to show updated verdict
      queryClient.invalidateQueries({
        queryKey: ["emails", String(mailboxId)],
      });

      // Refresh specific email details if open
      queryClient.invalidateQueries({
        queryKey: ["email", String(emailId)],
      });

      // Refresh analytics for updated threat stats
      queryClient.invalidateQueries({
        queryKey: ["analytics"],
      });

      if (securityVerdict && securityVerdict !== "SAFE" && securityVerdict !== "clean") {
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

      // Invalidate unread count
      queryClient.invalidateQueries({
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
      }
    },
    [queryClient],
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

    // Register domain event listeners
    socket.on(SocketEvent.NEW_EMAIL, handleNewEmail);
    socket.on(SocketEvent.EMAIL_SENT, handleEmailSent);
    socket.on(SocketEvent.EMAIL_SCANNED, handleEmailScanned);
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
      socket.off(SocketEvent.EMAIL_SENT, handleEmailSent);
      socket.off(SocketEvent.EMAIL_SCANNED, handleEmailScanned);
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
