import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailsApi } from "../../features/emails";
import { toast } from "sonner";

export const useReplyEmail = (mailboxId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      emailsApi.replyEmail(mailboxId, id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", mailboxId] });
      toast.success("Reply sent successfully");
    },
    onError: () => {},
  });
};

