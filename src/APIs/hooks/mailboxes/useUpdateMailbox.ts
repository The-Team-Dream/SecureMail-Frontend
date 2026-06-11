import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mailboxApi } from "../../features/mailboxes";
import { toast } from "sonner";
import { Mailbox } from "@/APIs/types/Mailbox";

export const useUpdateMailbox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: Partial<Mailbox>;
    }) => mailboxApi.updateMailbox(Number(id), data),

    onSuccess: (updatedMailbox, variables) => {
      toast.success("Settings Updated Successfully");

      queryClient.setQueryData(["mailboxes", String(variables.id)], updatedMailbox);

      queryClient.setQueryData(["mailboxes"], (old: any) => {
        if (!old) return old;

        const isArray = Array.isArray(old);
        const list = isArray ? old : (old.data || old.mailboxes || []);

        const updatedList = list.map((m: any) =>
          String(m.id) === String(variables.id)
            ? { ...m, ...updatedMailbox }
            : m
        );

        return isArray ? updatedList : { ...old, data: updatedList };
      });

      queryClient.invalidateQueries({ queryKey: ["mailboxes"], refetchType: 'all' });
    },

    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || "Failed to update settings";
      toast.error(message);
    },
  });
};