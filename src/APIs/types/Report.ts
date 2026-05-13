export interface SecurityReport {
  id: number;
  subject: string;
  from: string;
  fromName: string | null;
  date: string;
  classification: "phishing" | "spam" | "malware" | "clean";
  classificationReason: string;
  classificationScore: number;
  malwareVerdict: string | null;
  malwareScore: number | null;
  malwareSeverity: string | null;
  aiReport: string;
}
