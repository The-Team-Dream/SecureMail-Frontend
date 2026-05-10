import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailsApi } from "../../features/emails";
import { toast } from "sonner";

export const useSendEmail = (mailboxId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      emailsApi.sendEmail(mailboxId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", mailboxId] });
      toast.success("Email sent successfully");
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Failed to send email"),
  });
};

