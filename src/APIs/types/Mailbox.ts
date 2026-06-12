export type MailboxProvider = "GMAIL" | "OUTLOOK" | "IMAP";

export interface Folder {
  id: number;
  mailBoxId: number;
  name: string;
  type:
    | "INBOX"
    | "SPAM"
    | "TRASH"
    | "SENT"
    | "PHISHING"
    | "MALWARE"
    | string;
  remoteId: string;
  createdAt: string;
}

export interface Mailbox {
  id: number;
  userId: number;
  emailAddress: string;
  displayName: string;
  provider: MailboxProvider;
  isActive: boolean;
  pushNotificationsEnabled: boolean;
  emailForwarding: boolean;
  lastSyncedAt: string;
  createdAt: string;
  hasCredentials?: boolean;
  folders: Folder[];
  threatsCount: number;
  phishingScore?: number;
  spamScore?: number;
  malwareScore?: number;
  message?: string;
  _count: {
    emails: number;
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
  | { data: Mailbox[] | { mailboxes: Mailbox[] } }
  | { mailboxes: Mailbox[] };
