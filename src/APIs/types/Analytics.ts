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
  totalEmails: number;
  unreadEmails: number;
  sentEmails: number;
  spamEmails: number;
  phishingEmails: number;
  storageUsed: number;
  lastSyncTime: string;
}


export interface ActivityData {
  date: string;
  sent: number;
  received: number;
  spam: number;
  phishing: number;
}

export type ActivityPeriod = "daily" | "weekly" | "monthly";
