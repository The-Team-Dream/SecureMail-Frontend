import { useQuery } from "@tanstack/react-query";
import { emailsApi } from "../../features/emails";

export const useSearchEmails = (mailboxId: string, q: string, page: number) => {
  return useQuery({
    queryKey: ["emails", "search", mailboxId, q, page],
    queryFn: () => emailsApi.searchEmails(mailboxId, q, page),
    enabled: !!mailboxId && !!q,
  });
};
