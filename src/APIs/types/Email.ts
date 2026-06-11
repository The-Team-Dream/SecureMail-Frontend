
export type EmailFolder =
  | "inbox"
  | "sent"
  | "spam"
  | "phishing"
  | "starred"
  | "malware"
  | "trash";

export type SecurityVerdict = "clean" | "suspicious" | "malicious" | "unknown";

export type ActivityPeriod = "daily" | "weekly" | "monthly";

export interface Email {
  id: string | number;
  mailBoxId: number;
  subject: string;
  fromAddr: string;
  fromName: string;
  toAddr: string[];
  isRead: boolean;
  isFlagged: boolean;
  isSpam: boolean;
  isPhishing: boolean;
  receivedAt: string;
  spamScore: number;
  phishingScore: number;
  malwareVerdict: string | null;
  malwareScore: number | null;
  malwareSeverity: string | null;
  securityVerdict?: SecurityVerdict;
  folder?: EmailFolder;
  hasAttachments?: boolean;
  attachments?: Attachment[];
  analysisStatus?: "PENDING" | "COMPLETED" | "FAILED";
  isRescanning?: boolean;
}

export interface EmailsResponse {
  data: Email[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
export interface Attachment {
  id: string | number;
  filename: string;
  contentType?: string;
  size: number;
  url?: string;
}

export interface EmailDetails extends Email {
  bodyText?: string;
  bodyHtml?: string;
  attachments: Attachment[];
  cc?: string[];
  bcc?: string[];
  securityReport: {
    status: string;
    confidenceScore: number;
    detectionMessage: string;
    severity: string;
    priority: string;
    reason: string;
    description: string;
    recommendationTitle: string;
    recommendationText: string;
    suggestedActions: string[];
    anomalies: Array<{
      type: string;
      title: string;
      description: string;
    }>;
    analysisEngine: string;
  };
}
export interface SendEmailPayload {
  to: string;
  subject: string;
  cc?: string;
  bcc?: string;
  bodyText?: string;
  bodyHtml?: string;
  attachments?: File[];
}

export interface ReplyEmailPayload {
  content: string;
  bodyHtml?: string;
  attachments?: File[];
}

export interface ReclassifyPayload {
  folder: EmailFolder;
}
