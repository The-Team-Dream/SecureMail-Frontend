import { useQuery } from "@tanstack/react-query";
import { emailsApi } from "../../features/emails";

export const useEmailDetails = (mailboxId: string, emailId: string) => {
  return useQuery({
    queryKey: ["email", emailId],
    queryFn: () => emailsApi.getEmailDetails(mailboxId, emailId),
    staleTime: 5 * 60 * 1000,
    enabled: !!emailId,
  });
};
