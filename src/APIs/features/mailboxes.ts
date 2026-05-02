import axiosInstance from "@/lib/axios";
import { IMAPConfig, Mailbox } from "../types/Mailbox";


export const mailboxApi = {
  getMailboxes: async ():Promise<Mailbox[]> => {
    const res = await axiosInstance.get<Mailbox[]>('/mailboxes');
    return res.data;
  },

  getMailboxById: async (id: string):Promise<Mailbox> => {
    const res = await axiosInstance.get<Mailbox>(`/mailboxes/${id}`);
    return res.data;
  },

  getMailboxReports: async (id: string):Promise<Mailbox> => {
    const res = await axiosInstance.get<Mailbox>(`/mailboxes/${id}/reports`);
    return res.data;
  },

  updateMailbox: async (id: string, data: Partial<Mailbox>):Promise<Mailbox> => {
    const res = await axiosInstance.patch<Mailbox>(`/mailboxes/${id}`, data);
    return res.data;
  },

  deleteMailbox: async (id: string):Promise<Mailbox> => {
    const res = await axiosInstance.delete<Mailbox>(`/mailboxes/${id}`);
    return res.data;
  },

  syncMailbox: async (id: string):Promise<Mailbox> => {
    const res = await axiosInstance.post<Mailbox>(`/mailboxes/${id}/sync`);
    return res.data;
  },

  connectImap: async (data: IMAPConfig): Promise<Mailbox> => {
    const res = await axiosInstance.post<Mailbox>('/mailboxes/imap', data);
    return res.data;
  },

  getGmailAuthUrl: async (redirectUri: string): Promise<{ url: string }> => {
    const res = await axiosInstance.get<{ url: string }>(`/mailboxes/gmail/auth-url`, { 
      params: { redirectUri } 
    });
    return res.data;
  },

  connectGmail: async (code: string, redirectUri: string): Promise<Mailbox> => {
    const res = await axiosInstance.post<Mailbox>('/mailboxes/gmail', { code, redirectUri });
    return res.data;
  },

  getOutlookAuthUrl: async (redirectUri: string): Promise<{ url: string }> => {
    const res = await axiosInstance.get<{ url: string }>(`/mailboxes/outlook/auth-url`, { 
      params: { redirectUri } 
    });
    return res.data;
  },

  connectOutlook: async (code: string, redirectUri: string): Promise<Mailbox> => {
    const res = await axiosInstance.post<Mailbox>('/mailboxes/outlook', { code, redirectUri });
    return res.data;
  },
};