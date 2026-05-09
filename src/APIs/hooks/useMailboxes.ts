import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mailboxApi } from "../features/mailboxes";
import toast from "react-hot-toast";

export const useMailboxes = () => {
  return useQuery({
    queryKey: ["mailboxes"],
    queryFn: mailboxApi.getMailboxes,
  });
};

export const useMailboxById = (id: number | string) => {
  return useQuery({
    queryKey: ["mailboxes", id],
    queryFn: () => mailboxApi.getMailboxById(Number(id)),
    enabled: !!id,
  });
};

export const useMailboxReports = (id: number | string) => {
  return useQuery({
    queryKey: ["mailboxes", "reports", id],
    queryFn: () => mailboxApi.getMailboxReports(Number(id)),
    enabled: !!id,
  });
};

// --- Mutations ---
export const useMailboxOperations = () => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["mailboxes"] });

  const deleteMutation = useMutation({
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
    },
  });

  const syncMutation = useMutation({
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
      }

      // Directly update the mailboxes list in cache for instant UI update
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

      // Also update individual mailbox cache if it exists
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

      // Polling loop to wait for lastSyncedAt to update
      let attempts = 0;
      const maxAttempts = 10; // 10 * 2s = 20s max wait
      let isSynced = false;

      while (attempts < maxAttempts && !isSynced) {
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        try {
          const mailbox = await mailboxApi.getMailboxById(id);
          const lastSynced = new Date(mailbox.lastSyncedAt);
          // If lastSyncedAt is after we started, it means the sync job finished (or at least made progress)
          if (lastSynced >= startTime) {
            isSynced = true;
          }
        } catch (e) {
          // Ignore errors during polling
        }
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["mailboxes"] }),
        queryClient.invalidateQueries({
          queryKey: ["emails", id.toString()],
        }),
      ]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: any }) =>
      mailboxApi.updateMailbox(Number(id), data),
    onSuccess: (updatedMailbox, variables) => {
      toast.success("Settings Updated Successfully");
      // Update the specific mailbox cache
      queryClient.setQueryData(["mailboxes", variables.id], updatedMailbox);
      // Invalidate the list of mailboxes
      queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update settings");
    },
  });

  const connectGmailMutation = useMutation({
    mutationFn: ({
      code,
      redirectUri,
    }: {
      code: string;
      redirectUri: string;
    }) => mailboxApi.connectGmail(code, redirectUri),
    onSuccess: () => {
      toast.success("Gmail connected successfully");
      invalidate();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to connect Gmail");
    },
  });

  const connectOutlookMutation = useMutation({
    mutationFn: ({
      code,
      redirectUri,
    }: {
      code: string;
      redirectUri: string;
    }) => mailboxApi.connectOutlook(code, redirectUri),
    onSuccess: () => {
      toast.success("Outlook connected successfully");
      invalidate();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to connect Outlook");
    },
  });

  const connectImapMutation = useMutation({
    mutationFn: mailboxApi.connectImap,
    onSuccess: () => {
      toast.success("IMAP mailbox connected successfully!");
      invalidate();
    },
    // onError intentionally omitted — useAddAccountWizard catches and displays
    // the backend error message to avoid duplicate toast notifications.
  });

  return {
    deleteMailbox: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    syncMailbox: syncMutation.mutate,
    isSyncing: syncMutation.isPending
      ? syncMutation.variables?.toString()
      : null,
    updateMailbox: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    connectGmail: connectGmailMutation.mutateAsync,
    isConnectingGmail: connectGmailMutation.isPending,
    connectOutlook: connectOutlookMutation.mutateAsync,
    isConnectingOutlook: connectOutlookMutation.isPending,
    connectImap: connectImapMutation.mutateAsync,
    isConnectingImap: connectImapMutation.isPending,
  };
};
