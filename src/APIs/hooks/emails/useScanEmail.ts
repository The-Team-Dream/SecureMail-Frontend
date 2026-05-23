import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailsApi } from "../../features/emails";
import { toast } from "sonner";

export const useScanEmail = (mailboxId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => emailsApi.scanEmail(mailboxId, id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["emails", mailboxId] });
      queryClient.invalidateQueries({ queryKey: ["email", id] });
      toast.success("Security scan started in the background...");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to scan email");
    },
  });
};
