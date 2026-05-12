import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mailboxApi } from "../../features/mailboxes";
import { toast } from "sonner";

export const useConnectOutlook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      code,
      redirectUri,
    }: {
      code: string;
      redirectUri: string;
    }) => mailboxApi.connectOutlook(code, redirectUri),
    onSuccess: (newMailbox) => {
      toast.success("Outlook connected successfully");
      // Optimistically update the mailboxes list
      queryClient.setQueryData(["mailboxes"], (old: any) => {
        const mailboxes = Array.isArray(old) ? old : [];
        return [...mailboxes, newMailbox];
      });
      queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to connect Outlook");
    },
  });
};
