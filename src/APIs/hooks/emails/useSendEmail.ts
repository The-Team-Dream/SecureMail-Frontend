import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailsApi } from "../../features/emails";
import { toast } from "sonner";

export const useSendEmail = (mailboxId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      emailsApi.sendEmail(mailboxId, formData),
    onSuccess: () => {
      // Invalidate the broad emails key so all sub-queries (sent, inbox, etc.)
      // are marked stale. The actual cache pre-population happens in
      // useComposeEmail via prefetchQuery before navigation.
      queryClient.invalidateQueries({
        queryKey: ["emails", mailboxId],
      });

      toast.success("Email sent successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to send email");
    },
  });
};
