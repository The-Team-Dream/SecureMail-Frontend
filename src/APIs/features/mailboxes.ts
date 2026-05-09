import axiosInstance from "@/lib/axios";
import { IMAPConfig, Mailbox, Mailboxes } from "../types/Mailbox";

const unwrap = <T>(res: { data: unknown }): T => {
  const body = res.data as { data?: T };
  return (body?.data ?? res.data) as T;
};

export const mailboxApi = {
  getMailboxes: async (): Promise<Mailbox[]> => {
    const res = await axiosInstance.get<Mailboxes>("/mailboxes");
    const data = res.data;

    if (Array.isArray(data)) return data;

    if ("data" in data) {
      if (Array.isArray(data.data)) return data.data;
      if (data.data && "mailboxes" in data.data && Array.isArray(data.data.mailboxes)) {
        return data.data.mailboxes;
      }
    }

    if ("mailboxes" in data && Array.isArray(data.mailboxes)) {
      return data.mailboxes;
    }

    return [];
  },

  getMailboxById: async (id: number): Promise<Mailbox> => {
    return unwrap(await axiosInstance.get(`/mailboxes/${id}`));
  },

  getMailboxReports: async (id: number): Promise<Mailbox> => {
    return unwrap(await axiosInstance.get(`/mailboxes/${id}/reports`));
  },

  updateMailbox: async (
    id: number,
    data: Partial<Mailbox>,
  ): Promise<Mailbox> => {
    return unwrap(await axiosInstance.patch(`/mailboxes/${id}`, data));
  },

  deleteMailbox: async (id: number): Promise<Mailbox> => {
    return unwrap(await axiosInstance.delete(`/mailboxes/${id}`));
  },

  syncMailbox: async (id: number): Promise<Mailbox> => {
    return unwrap(await axiosInstance.post(`/mailboxes/${id}/sync`));
  },

  connectImap: async (raw: IMAPConfig): Promise<Mailbox> => {
    // ── Sanitize & validate before sending ──────────────────────────────────
    const port = Number(raw.port);
    const smtpPort = raw.smtpPort !== undefined ? Number(raw.smtpPort) : undefined;

    if (!raw.host?.trim()) throw new Error("IMAP host is required.");
    if (isNaN(port) || port < 1 || port > 65535) throw new Error("IMAP port must be between 1–65535.");
    if (!raw.email?.trim()) throw new Error("Email is required.");
    if (!raw.password?.trim()) throw new Error("Password is required.");
    if (!raw.displayName?.trim()) throw new Error("Display name is required.");

    const payload: IMAPConfig = {
      host: raw.host.trim(),
      port,
      email: raw.email.trim(),
      password: raw.password,
      secure: Boolean(raw.secure),
      displayName: raw.displayName.trim(),
      ...(raw.smtpHost?.trim() && { smtpHost: raw.smtpHost.trim() }),
      ...(smtpPort && !isNaN(smtpPort) && { smtpPort }),
    };

    const res = await axiosInstance.post("/mailboxes/imap", payload);
    return unwrap(res);
  },

  getGmailAuthUrl: async (redirectUri: string): Promise<{ url: string }> => {
    const res = await axiosInstance.get<{ data?: { url: string }; url?: string; authUrl?: string; redirectUrl?: string }>(
      `/mailboxes/gmail/auth-url`,
      { params: { redirectUri } },
    );
    const body = res.data;
    const url = body?.data?.url || body?.url || body?.authUrl || body?.redirectUrl;
    
    if (!url || typeof url !== "string") {
      console.error("Gmail Auth URL Error. Response body:", body);
      throw new Error("Invalid auth URL returned from Gmail endpoint.");
    }
    return { url };
  },

  connectGmail: async (code: string, redirectUri: string): Promise<Mailbox> => {
    const res = await axiosInstance.post("/mailboxes/gmail", {
      code,
      redirectUri,
    });
    return unwrap(res);
  },

  getOutlookAuthUrl: async (redirectUri: string): Promise<{ url: string }> => {
    const res = await axiosInstance.get<{ data?: { url: string }; url?: string; authUrl?: string; redirectUrl?: string }>(
      `/mailboxes/outlook/auth-url`,
      { params: { redirectUri } },
    );
    const body = res.data;
    const url = body?.data?.url || body?.url || body?.authUrl || body?.redirectUrl;

    if (!url || typeof url !== "string") {
      console.error("Outlook Auth URL Error. Response body:", body);
      throw new Error("Invalid auth URL returned from Outlook endpoint.");
    }
    return { url };
  },

  connectOutlook: async (
    code: string,
    redirectUri: string,
  ): Promise<Mailbox> => {
    const res = await axiosInstance.post("/mailboxes/outlook", {
      code,
      redirectUri,
    });
    return unwrap(res);
  },
};
