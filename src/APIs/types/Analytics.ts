export interface AnalyticsOverview {
  totalEmails: number;
  totalMailboxesConnected: number;
  totalPhishingDetected: number;
  totalSpamDetected: number;
  totalMalwareDetected: number;
  totalStorageUsed: number;
  totalEmailsSent: number;
  totalEmailsReceived: number;
  threatsChange: string;
  phishingChange: string;
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
