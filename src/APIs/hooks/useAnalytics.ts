
import { useQuery } from "@tanstack/react-query"
import { analyticsApi } from "../features/analytics"

export const useAnalyticsOverview = () => {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: analyticsApi.getOverview,
    staleTime: 5 * 60 * 1000, 
  });
};

export const useMailboxStats = (mailboxId: string) => {
  return useQuery({
    queryKey: ['analytics', 'mailbox', mailboxId],
    queryFn: () => analyticsApi.getMailboxStats(mailboxId),
    enabled: !!mailboxId, 
  });
};

export const useActivityStats = (period: 'daily' | 'weekly' | 'monthly') => {
  return useQuery({
    queryKey: ['analytics', 'activity', period], 
    queryFn: () => analyticsApi.getActivity(period),
    placeholderData: (previousData) => previousData, 
  });
};
