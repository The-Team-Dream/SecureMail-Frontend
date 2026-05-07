
import axiosInstance from "@/lib/axios";
import { ActivityData, ActivityPeriod, AnalyticsOverview, MailboxStats } from "../types/Analytics";

export const analyticsApi = {
  getOverview: async (): Promise<AnalyticsOverview> => {
    const res = await axiosInstance.get<AnalyticsOverview>('/analytics/overview');
    return res.data;
  },

  getMailboxStats: async (mailboxId: string): Promise<MailboxStats> => {
    const res = await axiosInstance.get<MailboxStats>(`/analytics/mailboxes/${mailboxId}`);
    return res.data;
  },

  getActivity: async (period: ActivityPeriod = 'daily'): Promise<ActivityData[]> => {
    const res = await axiosInstance.get<ActivityData[]>('/analytics/activity', { params: { period } });
    return res.data;
  },
};
