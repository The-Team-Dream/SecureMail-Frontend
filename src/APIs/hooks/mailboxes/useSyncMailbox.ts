import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mailboxApi } from "../../features/mailboxes";
import { toast } from "sonner";

export const useSyncMailbox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => mailboxApi.syncMailbox(Number(id)),
    onMutate: async (id: string | number) => {
      await queryClient.cancelQueries({ queryKey: ["mailboxes"] });
      const previousMailboxes = queryClient.getQueryData<any[]>(["mailboxes"]);

      if (previousMailboxes) {
        queryClient.setQueryData(
          ["mailboxes"],
          previousMailboxes.map((mailbox) =>
            mailbox.id?.toString() === id?.toString()
              ? { ...mailbox, status: "syncing" }
              : mailbox,
          ),
        );
      }

      return { previousMailboxes, startTime: new Date() };
    },
    onSuccess: (data, variables) => {
      const mailboxId = data?.id?.toString() || variables?.toString();
      if (!mailboxId) return;

      queryClient.setQueryData(["mailboxes"], (old: any) => {
        if (Array.isArray(old)) {
          return old.map((m) =>
            m.id?.toString() === mailboxId ? { ...m, ...data } : m,
          );
        }
        if (old?.data && Array.isArray(old.data)) {
          return {
            ...old,
            data: old.data.map((m: any) =>
              m.id?.toString() === mailboxId ? { ...m, ...data } : m,
            ),
          };
        }
        return old;
      });

      queryClient.setQueryData(["mailboxes", mailboxId], (old: any) =>
        old ? { ...old, ...data } : data,
      );
    },
    onError: (error: any, _id, context) => {
      if (context?.previousMailboxes) {
        queryClient.setQueryData(["mailboxes"], context.previousMailboxes);
      }
      toast.error(
        error.response?.data?.message ||
          error?.message ||
          "Failed to sync mailbox",
      );
    },
    // WebSocket events (mailbox-sync-complete / mailbox-sync-failed) handle
    // real-time cache invalidation. We only do a single delayed invalidation
    // here as a safety-net fallback.
    onSettled: async (_data, _error, variables) => {
      if (!variables) return;
      const id = Number(variables);

      // Short delay to let the server start processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["mailboxes"] }),
        queryClient.invalidateQueries({
          queryKey: ["emails", id.toString()],
        }),
      ]);
    },
  });
};
