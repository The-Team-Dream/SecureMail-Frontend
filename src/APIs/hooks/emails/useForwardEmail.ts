import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailsApi } from "../../features/emails";
import { toast } from "sonner";

export const useForwardEmail = (mailboxId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      emailsApi.forwardEmail(mailboxId, id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", mailboxId] });
      toast.success("Email forwarded successfully");
    },
    onError: () => {},
  });
};

