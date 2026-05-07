export type MailboxProvider = "GMAIL" | "OUTLOOK" | "IMAP";

export interface Mailbox {
  id: string | number;
  userId: number | string;
  email: string;
  emailAddress?: string;
  displayName: string;
  provider: string;
  status?: "connected" | "disconnected" | "syncing" | "error";
  isActive: boolean;
  totalEmails?: number;
  threatsCount?: number;
  lastSync?: string;
  lastSyncedAt?: string;
  pushNotificationsEnabled: boolean;
  avatar?: string | null;
  _count?: {
    emails: number;
    threats?: number;
  };
}

export interface IMAPConfig {
  host: string;
  port: number;
  email: string;
  password: string;
  secure: boolean;
  displayName: string;
  smtpHost?: string;
  smtpPort?: number;
}

export type Mailboxes =
  | Mailbox[]
  | {
      data?: Mailbox[] | { mailboxes?: Mailbox[] };
      mailboxes?: Mailbox[];
    };
