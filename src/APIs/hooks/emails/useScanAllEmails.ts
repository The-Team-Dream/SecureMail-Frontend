import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailsApi } from "../../features/emails";
import { toast } from "sonner";

export const useScanAllEmails = (mailboxId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => emailsApi.scanAllEmails(mailboxId),
    onSuccess: (data) => {
      toast.success(data.message || "Bulk scan started in background");
      // Invalidate the scan-progress query to start polling immediately
      queryClient.invalidateQueries({ queryKey: ["scan-progress", mailboxId] });
      // Update emails list to show pending statuses
      queryClient.invalidateQueries({ queryKey: ["emails", mailboxId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to start bulk scan");
    },
  });
};
