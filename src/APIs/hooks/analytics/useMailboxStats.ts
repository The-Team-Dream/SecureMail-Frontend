import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../../features/analytics";

export const useMailboxStats = (mailboxId: string) => {
  return useQuery({
    queryKey: ["analytics", "mailbox", mailboxId],
    queryFn: () => analyticsApi.getMailboxStats(mailboxId),
    enabled: !!mailboxId,
  });
};
