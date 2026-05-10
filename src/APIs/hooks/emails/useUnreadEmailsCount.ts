import { useQueryClient } from "@tanstack/react-query";
import type { EmailFolder } from "../../types/Email";

export const useUnreadEmailsCount = (
  mailboxId: string,
  folder: EmailFolder = "inbox",
) => {
  const queryClient = useQueryClient();
  // Get all cached pages for this folder
  const queries = queryClient.getQueriesData<any>({
    queryKey: ["emails", mailboxId, folder],
  });

  let count = 0;
  queries.forEach(([_, data]) => {
    if (data && data.data && Array.isArray(data.data)) {
      count += data.data.filter((e: any) => !e.isRead).length;
    }
  });
  return count;
};
