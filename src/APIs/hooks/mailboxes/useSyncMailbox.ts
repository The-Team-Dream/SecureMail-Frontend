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

      if (data?.message) {
        toast.success(data.message);
      } else {
        toast.success("Mailbox synchronization started");
      }

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
      toast.error(error.response?.data?.message || error?.message || "Failed to sync mailbox");
    },
    onSettled: async (_data, _error, variables, context: any) => {
      if (!variables) return;
      const id = Number(variables);
      const startTime = context?.startTime || new Date();

      let attempts = 0;
      const maxAttempts = 10;
      let isSynced = false;

      while (attempts < maxAttempts && !isSynced) {
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        try {
          const mailbox = await mailboxApi.getMailboxById(id);
          const lastSynced = new Date(mailbox.lastSyncedAt);
          if (lastSynced >= startTime) {
            isSynced = true;
          }
        } catch (e) {}
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["mailboxes"] }),
        queryClient.invalidateQueries({
          queryKey: ["emails", id.toString()],
        }),
      ]);
    },
  });
};

