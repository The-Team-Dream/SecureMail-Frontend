export type Folder =
  | "inbox"
  | "sent"
  | "starred"
  | "trash"
  | "spam"
  | "phishing"
  | "malware"
  | "archive"
  | "analytics"
  | "security-reports";

export type Classification = "primary" | "promotions" | "social" | "updates";

export interface Email {
  id: string;
  subject: string;
  bodyText: string;
  sender: string;
  senderEmail: string;
  isRead: boolean;
  isStarred: boolean;
  folder: Folder;
  classification: Classification;
  date: string;
  hasAttachment: boolean;
  attachmentName?: string;
  riskLevel?: string;
}

export interface MalwareThreat {
  id: string;
  fileName: string;
  threatType: string;
  senderEmail: string;
}
