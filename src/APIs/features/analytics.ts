
import axiosInstance from "@/lib/axios";
import { ActivityData, ActivityPeriod, AnalyticsOverview, MailboxStats } from "../types/Analytics";

const unwrap = <T>(res: { data: any }): T => {
  return res.data?.data ?? res.data;
};

export const analyticsApi = {
  getOverview: async (): Promise<AnalyticsOverview> => {
    const res = await axiosInstance.get<any>('/analytics/overview');
    return unwrap(res);
  },

  getMailboxStats: async (mailboxId: string): Promise<MailboxStats> => {
    const res = await axiosInstance.get<any>(`/analytics/mailboxes/${mailboxId}`);
    return unwrap(res);
  },

  getActivity: async (period: ActivityPeriod = 'daily'): Promise<ActivityData[]> => {
    const res = await axiosInstance.get<any>('/analytics/activity', { params: { period } });
    return unwrap(res);
  },
};
