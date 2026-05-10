import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mailboxApi } from "../../features/mailboxes";
import { toast } from "sonner";

export const useDeleteMailbox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => mailboxApi.deleteMailbox(Number(id)),
    onMutate: async (id: string | number) => {
      await queryClient.cancelQueries({ queryKey: ["mailboxes"] });
      const previousMailboxes = queryClient.getQueryData<any[]>(["mailboxes"]);

      if (previousMailboxes) {
        queryClient.setQueryData(
          ["mailboxes"],
          previousMailboxes.filter((mailbox) => mailbox.id !== id),
        );
      }

      return { previousMailboxes };
    },
    onError: (error: any, _id, context) => {
      if (context?.previousMailboxes) {
        queryClient.setQueryData(["mailboxes"], context.previousMailboxes);
      }
      toast.error(error?.message || "Failed to delete mailbox");
    },
    onSuccess: () => {
      toast.success("Mailbox deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
    },
  });
};

