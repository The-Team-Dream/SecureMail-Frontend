
import axiosInstance from "@/lib/axios";
import { ActivityPeriod, AnalyticsOverview, MailboxStats } from "../types/Analytics";

export const analyticsApi = {
  getOverview: async (): Promise<AnalyticsOverview> => {
    const res = await axiosInstance.get<AnalyticsOverview>('/analytics/overview');
    return res.data;
  },

  getMailboxStats: async (mailboxId: string): Promise<MailboxStats> => {
    const res = await axiosInstance.get<MailboxStats>(`/analytics/mailboxes/${mailboxId}`);
    return res.data;
  },

  getActivity: async (period: ActivityPeriod = 'daily'):Promise<any> => {
    const res = await axiosInstance.get('/analytics/activity', { params: { period } });
    return res.data;
  },
};
