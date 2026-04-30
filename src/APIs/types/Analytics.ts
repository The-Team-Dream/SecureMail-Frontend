export interface AnalyticsOverview {
  totalMailboxes: number;
  totalEmailsScanned: number;
  totalThreatsBlocked: number;
  phishingDetected: number;
  malwareDetected: number;
  safetyScore: number; 
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
  timestamp: string;
  sent: number;
  received: number;
  blocked: number;
}

export type ActivityPeriod = 'daily' | 'weekly' | 'monthly';