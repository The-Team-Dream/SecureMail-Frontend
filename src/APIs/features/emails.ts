import axiosInstance from "@/lib/axios";
import type { EmailDetails, EmailsResponse, EmailFolder } from "../types/Email";

const unwrap = <T>(res: { data: any }): T => {
  return res.data?.data ?? res.data;
};

export const emailsApi = {
  // Get Emails List (Inbox, Sent, Spam, Phishing, Starred, Malware, Trash)
  getEmails: async (
    mailboxId: string,
    folder: EmailFolder,
    page = 1,
    limit = 20,
  ): Promise<EmailsResponse> => {
    const res = await axiosInstance.get<EmailsResponse>(
      `/mailboxes/${mailboxId}/${folder}`,
      {
        params: { page, limit },
      },
    );
    return unwrap(res);
  },

  // Search Emails
  searchEmails: async (
    mailboxId: string,
    q: string,
    page = 1,
    limit = 20,
  ): Promise<EmailsResponse> => {
    const res = await axiosInstance.get<EmailsResponse>(
      `/mailboxes/${mailboxId}/search`,
      {
        params: { q, page, limit },
      },
    );
    return unwrap(res);
  },

  // Get Email Details
  getEmailDetails: async (
    mailboxId: string,
    emailId: string,
  ): Promise<EmailDetails> => {
    const res = await axiosInstance.get<EmailDetails>(
      `/mailboxes/${mailboxId}/emails/${emailId}`,
    );
    return unwrap(res);
  },

  // Delete Email
  deleteEmail: async (mailboxId: string, emailId: string): Promise<void> => {
    const res = await axiosInstance.delete(
      `/mailboxes/${mailboxId}/emails/${emailId}`,
    );
    return unwrap(res);
  },
  // Mark as Read
  markAsRead: async (
    mailboxId: string,
    emailId: string,
    read: boolean,
  ): Promise<void> => {
    const res = await axiosInstance.patch(
      `/mailboxes/${mailboxId}/emails/${emailId}/read`,
      { read },
    );
    return unwrap(res);
  },

  // Star Email
  starEmail: async (
    mailboxId: string,
    emailId: string,
    starred: boolean,
  ): Promise<void> => {
    const res = await axiosInstance.put(
      `/mailboxes/${mailboxId}/emails/${emailId}/star`,
      { starred },
    );
    return unwrap(res);
  },

  // Report Email
  reportEmail: async (
    mailboxId: string,
    emailId: string,
    type: "spam" | "phishing",
  ): Promise<void> => {
    const res = await axiosInstance.post(
      `/mailboxes/${mailboxId}/emails/${emailId}/report`,
      { type },
    );
    return unwrap(res);
  },
  // Reclassify Email
  reclassify: async (
    mailboxId: string,
    emailId: string,
    folder: EmailFolder,
  ): Promise<void> => {
    const res = await axiosInstance.patch(
      `/mailboxes/${mailboxId}/emails/${emailId}/reclassify`,
      { folder },
    );
    return unwrap(res);
  },

  // Sending (Multipart Form Data)
  sendEmail: async (
    mailboxId: string,
    formData: FormData,
  ): Promise<{ id: string }> => {
    const res = await axiosInstance.post(
      `/mailboxes/${mailboxId}/send`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return unwrap(res);
  },

  // Reply & Forward
  replyEmail: async (
    mailboxId: string,
    emailId: string,
    formData: FormData,
  ): Promise<{ id: string }> => {
    const res = await axiosInstance.post(
      `/mailboxes/${mailboxId}/emails/${emailId}/reply`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return unwrap(res);
  },

  forwardEmail: async (
    mailboxId: string,
    emailId: string,
    formData: FormData,
  ): Promise<{ id: string }> => {
    const res = await axiosInstance.post(
      `/mailboxes/${mailboxId}/emails/${emailId}/forward`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return unwrap(res);
  },

  // Download Attachment
  downloadAttachment: async (
    mailboxId: string,
    emailId: string,
    attachmentId: string,
  ): Promise<void> => {
    const url = `${axiosInstance.defaults.baseURL}/mailboxes/${mailboxId}/emails/${emailId}/attachments/${attachmentId}/download`;
    window.open(url, "_blank");
  },
};
