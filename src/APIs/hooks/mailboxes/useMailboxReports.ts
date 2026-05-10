import { useQuery } from "@tanstack/react-query";
import { mailboxApi } from "../../features/mailboxes";

export const useMailboxReports = (id: number | string) => {
  return useQuery({
    queryKey: ["mailboxes", "reports", id],
    queryFn: () => mailboxApi.getMailboxReports(Number(id)),
    enabled: !!id,
  });
};
