export type MailboxProvider = "GMAIL" | "OUTLOOK" | "IMAP";

export interface Mailbox {
  id: string;
  email: string;
  displayName: string;
  provider: MailboxProvider;
  status: "connected" | "disconnected" | "syncing" | "error";
  totalEmails: number;
  threatsCount: number;
  lastSync: string;
  pushNotificationsEnabled: boolean;
}

export interface IMAPConfig {
  host: string;
  port: number;
  email: string;
  password?: string;
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
