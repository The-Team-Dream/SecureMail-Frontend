import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { emailsApi } from "../../features/emails";
import type { EmailFolder } from "../../types/Email";

export const useEmails = (
  mailboxId: string,
  folder: EmailFolder,
  page: number,
) => {
  const queryClient = useQueryClient();
  const queryKey = ["emails", mailboxId, folder, page];

  // Get the current cache data to determine if there's any temp email
  const currentCache = queryClient.getQueryData<any>(queryKey);
  const hasTemp = (currentCache?.data || []).some((e: any) =>
    String(e.id).startsWith("temp-")
  );

  return useQuery({
    queryKey,
    queryFn: async () => {
      const freshData = await emailsApi.getEmails(mailboxId, folder, page);
      
      // Look up the current query cache right before returning
      const latestCache = queryClient.getQueryData<any>(queryKey);
      if (latestCache && folder === "sent" && page === 1) {
        const tempEmails = (latestCache.data || []).filter((e: any) =>
          String(e.id).startsWith("temp-")
        );
        
        // Find any temp email whose subject/recipient is NOT yet present in the fresh server data
        const unmatchedTemp = tempEmails.filter((temp: any) =>
          !(freshData.data || []).some(
            (fresh: any) =>
              fresh.subject === temp.subject &&
              (Array.isArray(fresh.toAddr) && Array.isArray(temp.toAddr)
                ? fresh.toAddr.join(",") === temp.toAddr.join(",")
                : fresh.toAddr === temp.toAddr)
          )
        );

        if (unmatchedTemp.length > 0) {
          // Prepend unmatched temp emails to the fresh server list
          freshData.data = [...unmatchedTemp, ...(freshData.data || [])];
          
          if (freshData.meta) {
            freshData.meta.total = (freshData.meta.total || 0) + unmatchedTemp.length;
          }
        }
      }
      return freshData;
    },
    enabled: !!mailboxId && !!folder,
    placeholderData: keepPreviousData,
    refetchInterval: hasTemp ? 3000 : false,
  });
};
