import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailsApi } from "../../features/emails";
import { toast } from "sonner";

export const useForwardEmail = (mailboxId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      emailsApi.forwardEmail(mailboxId, id, formData),
    onSuccess: () => {
      toast.success("Email forwarded successfully");
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["emails", mailboxId] });
      }, 2000);
    },
    onError: () => {},
  });
};

