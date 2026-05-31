import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mailboxApi } from "../../features/mailboxes";
import { toast } from "sonner";
import { Mailbox } from "@/APIs/types/Mailbox";

export const useSyncMailbox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => mailboxApi.syncMailbox(Number(id)),
    onMutate: async (id: string | number) => {
      await queryClient.cancelQueries({ queryKey: ["mailboxes"] });
      const previousMailboxes = queryClient.getQueryData<Mailbox[]>([
        "mailboxes",
      ]);

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

      // getMailboxes always returns a flat Mailbox[] — update it in place.
      queryClient.setQueryData(["mailboxes"], (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.map((m) =>
          m.id?.toString() === mailboxId ? { ...m, ...data } : m,
        );
      });

      // Also update the individual mailbox cache if it exists.
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
      const mailboxId = variables.toString();

      // Short delay to let the server start processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["mailboxes"] }),
        queryClient.invalidateQueries({ queryKey: ["mailboxes", mailboxId] }),
        // emails query key shape: ["emails", mailboxId, folder, page]
        queryClient.invalidateQueries({ queryKey: ["emails", mailboxId] }),
      ]);
    },
  });
};
