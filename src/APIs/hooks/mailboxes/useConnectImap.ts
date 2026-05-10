import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mailboxApi } from "../../features/mailboxes";
import { toast } from "sonner";

export const useConnectImap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mailboxApi.connectImap,
    onSuccess: () => {
      toast.success("IMAP mailbox connected successfully!");
      queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
    },
  });
};

