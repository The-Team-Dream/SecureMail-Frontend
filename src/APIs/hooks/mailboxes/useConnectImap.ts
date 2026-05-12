import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mailboxApi } from "../../features/mailboxes";
import { toast } from "sonner";

export const useConnectImap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mailboxApi.connectImap,
    onSuccess: (newMailbox) => {
      toast.success("IMAP mailbox connected successfully!");
      // Optimistically update the mailboxes list
      queryClient.setQueryData(["mailboxes"], (old: any) => {
        const mailboxes = Array.isArray(old) ? old : [];
        return [...mailboxes, newMailbox];
      });
      queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
    },
  });
};
