import axiosInstance from "@/lib/axios";
import type { EmailDetails, EmailsResponse } from "../types/Email";

export const emailsApi = {
  // Get Emails List (Inbox, Sent, Spam, Phishing)
  getEmails: async (mailboxId: string, folder: string, page = 1, limit = 20): Promise<EmailsResponse> => {
    const res = await axiosInstance.get<EmailsResponse>(`/mailboxes/${mailboxId}/${folder}`, {
      params: { page, limit },
    });
    return res.data;
  },

  // Get Email Details
  getEmailDetails: async (mailboxId: string, emailId: string): Promise<EmailDetails> => {
    const res = await axiosInstance.get<EmailDetails>(`/mailboxes/${mailboxId}/emails/${emailId}`);
    return res.data;
  },

  // Delete Email
  deleteEmail: async (mailboxId: string, emailId: string): Promise<void> => {
    const res = await axiosInstance.delete(`/mailboxes/${mailboxId}/emails/${emailId}`);
    return res.data;
  },
// Mark as Read
  markAsRead: async (mailboxId: string, emailId: string, read: boolean): Promise<void> => {
    const res = await axiosInstance.patch(`/mailboxes/${mailboxId}/emails/${emailId}/read`, { read });
    return res.data;
  },
// Reclassify Email
  reclassify: async (mailboxId: string, emailId: string, folder: string): Promise<void> => {
    const res = await axiosInstance.patch(`/mailboxes/${mailboxId}/emails/${emailId}/reclassify`, { folder });
    return res.data;
  },

  // Sending (Multipart Form Data)
  sendEmail: async (mailboxId: string, formData: FormData): Promise<{ id: string }> => {
    const res = await axiosInstance.post(`/mailboxes/${mailboxId}/send`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  
  // Reply & Forward
  replyEmail: async (mailboxId: string, emailId: string, formData: FormData): Promise<{ id: string }> => {
    const res = await axiosInstance.post(`/mailboxes/${mailboxId}/emails/${emailId}/reply`, formData);
    return res.data;
  },
};