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

      // Update individual mailbox cache
      queryClient.setQueryData(["mailboxes", variables.id], updatedMailbox);

      // Update the list of mailboxes cache to reflect change immediately in Navbar/Sidebar
      queryClient.setQueryData(["mailboxes"], (old: any) => {
        if (!old) return old;

        // Handle if data is wrapped in an object or is a direct array
        const list = Array.isArray(old) ? old : old.data || old.mailboxes || [];
        const updatedList = list.map((m: any) =>
          String(m.id) === String(variables.id)
            ? { ...m, ...updatedMailbox }
            : m,
        );

        return Array.isArray(old) ? updatedList : { ...old, data: updatedList };
      });

      queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
    },
    onError: (error: any) => {
      toast.error(error?.message.data || "Failed to update settings");
    },
  });
};
