import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mailboxApi } from "../../features/mailboxes";
import { toast } from "sonner";

export const useUpdateMailbox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: any }) =>
      mailboxApi.updateMailbox(Number(id), data),
    onSuccess: (updatedMailbox, variables) => {
      toast.success("Settings Updated Successfully");
      queryClient.setQueryData(["mailboxes", variables.id], updatedMailbox);
      queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update settings");
    },
  });
};

