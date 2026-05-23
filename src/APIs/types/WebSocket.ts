import type { Notification } from "./Notification";
import type { Email } from "./Email";

// ─── Server → Client Events ─────────────────────────────────────────────────

/** Fired when a new email is received in any connected mailbox */
export interface NewEmailEvent {
  mailboxId: number;
  email: Email;
}

/** Fired when an email is successfully sent and saved */
export interface EmailSentEvent {
  mailboxId: number;
}

/** Fired when email scan/analysis is complete */
export interface EmailScannedEvent {
  mailboxId: number;
  emailId: number | string;
  securityVerdict: string;
  spamScore: number;
  phishingScore: number;
  malwareVerdict?: string | null;
}

/** Fired when a new notification is created server-side */
export interface NewNotificationEvent {
  notification: Notification;
}

/** Fired when a mailbox sync completes */
export interface MailboxSyncCompleteEvent {
  mailboxId: number;
  lastSyncedAt: string;
  newEmailsCount: number;
}

/** Fired when a mailbox sync fails */
export interface MailboxSyncFailedEvent {
  mailboxId: number;
  error: string;
}

/** Fired when a security threat is detected */
export interface SecurityAlertEvent {
  type: "phishing" | "spam" | "malware" | "suspicious_login";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}

/** Fired when a mailbox is connected/disconnected */
export interface MailboxStatusEvent {
  mailboxId: number;
  status: "connected" | "disconnected" | "error";
  message?: string;
}

// ─── Event Name Map ──────────────────────────────────────────────────────────

export enum SocketEvent {
  // Connection lifecycle
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  CONNECT_ERROR = "connect_error",

  // Email events
  NEW_EMAIL = "new-email",
  EMAIL_SCANNED = "email_analyzed",
  EMAIL_SENT = "email-sent",

  // Notification events
  NEW_NOTIFICATION = "notification",

  // Mailbox events
  MAILBOX_SYNC_COMPLETE = "mailbox_sync_complete",
  MAILBOX_SYNC_FAILED = "mailbox-sync-failed",
  MAILBOX_STATUS = "mailbox-status",

  // Security events
  SECURITY_ALERT = "security-alert",
}

// ─── Listener Type Map ───────────────────────────────────────────────────────

export interface ServerToClientEvents {
  [SocketEvent.NEW_EMAIL]: (data: NewEmailEvent) => void;
  [SocketEvent.EMAIL_SCANNED]: (data: EmailScannedEvent) => void;
  [SocketEvent.EMAIL_SENT]: (data: EmailSentEvent) => void;
  [SocketEvent.NEW_NOTIFICATION]: (data: NewNotificationEvent) => void;
  [SocketEvent.MAILBOX_SYNC_COMPLETE]: (data: MailboxSyncCompleteEvent) => void;
  [SocketEvent.MAILBOX_SYNC_FAILED]: (data: MailboxSyncFailedEvent) => void;
  [SocketEvent.MAILBOX_STATUS]: (data: MailboxStatusEvent) => void;
  [SocketEvent.SECURITY_ALERT]: (data: SecurityAlertEvent) => void;
}
