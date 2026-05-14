import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mailboxApi } from "../../features/mailboxes";
import { toast } from "sonner";
import type { Mailbox } from "../../types/Mailbox";

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
      toast.success("Outlook connected successfully", { id: "connect-outlook" });
      // Optimistically update the mailboxes list
      queryClient.setQueryData(["mailboxes"], (old: Mailbox[]) => {
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
