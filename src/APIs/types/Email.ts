export type EmailFolder = 'inbox' | 'sent' | 'spam' | 'phishing' | 'starred' | 'malware' | 'trash';

export type SecurityVerdict = 'clean' | 'suspicious' | 'malicious' | 'unknown';

export type ActivityPeriod = 'daily' | 'weekly' | 'monthly';

export interface Email {
  id: string;
  sender: {
    name: string;
    email: string;
  };
  subject: string;
  snippet: string;
  date: string;
  read: boolean;
  hasAttachments: boolean;
  securityVerdict: SecurityVerdict;
  folder: EmailFolder;
}

export interface EmailsResponse {
  data: Email[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
}
export interface Attachment {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  url: string;
}

export interface EmailDetails extends Email {
  bodyText?: string;
  bodyHtml?: string;
  attachments: Attachment[];
  cc?: string[];
  bcc?: string[];
  securityReport: {
    isPhishing: boolean;
    isMalware: boolean;
    threatDetails: string[];
    aiAnalysis: string; 
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