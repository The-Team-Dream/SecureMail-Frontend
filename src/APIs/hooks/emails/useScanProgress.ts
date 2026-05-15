import { useQuery } from "@tanstack/react-query";
import { emailsApi } from "../../features/emails";
import { ScanProgress } from "../../features/emails/getScanProgress";

export const useScanProgress = (mailboxId: string) => {
  return useQuery({
    queryKey: ["scan-progress", mailboxId],
    queryFn: () => emailsApi.getScanProgress(mailboxId),
    refetchInterval: (query) => {
      const data = query.state.data as ScanProgress | undefined;
      if (data?.isScanning) {
        return 2000;
      }
      return false;
    },
    enabled: !!mailboxId,
  });
};
