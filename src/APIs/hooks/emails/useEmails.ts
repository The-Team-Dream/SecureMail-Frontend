import { useQuery } from "@tanstack/react-query";
import { emailsApi } from "../../features/emails";
import type { EmailFolder } from "../../types/Email";

export const useEmails = (
  mailboxId: string,
  folder: EmailFolder,
  page: number,
) => {
  return useQuery({
    queryKey: ["emails", mailboxId, folder, page],
    queryFn: () => emailsApi.getEmails(mailboxId, folder, page),
    staleTime: 5 * 60 * 1000,
    enabled: !!mailboxId && !!folder,
  });
};
