export interface AnalyticsOverview {
  totalEmails: number;
  totalMailboxesConnected: number;
  totalPhishingDetected: number;
  totalSpamDetected: number;
  totalStorageUsed: number;
  totalEmailsSent: number;
  totalEmailsReceived: number;
}

export interface MailboxStats {
  mailboxId: string;
  emailCount: number;
  threatsHistory: {
    date: string;
    count: number;
  }[];
  topThreatTypes: {
    type: string;
    value: number;
  }[];
}

export interface ActivityData {
  date: string;
  sent: number;
  received: number;
  spam: number;
  phishing: number;
}

export type ActivityPeriod = "daily" | "weekly" | "monthly";
