import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mailboxApi } from "../features/mailboxes";
import toast from "react-hot-toast";

export const useMailboxes = () => {
  return useQuery({
    queryKey: ["mailboxes"],
    queryFn: mailboxApi.getMailboxes,
  });
};

export const useMailboxById = (id: string | number) => {
  return useQuery({
    queryKey: ["mailboxes", id],
    queryFn: () => mailboxApi.getMailboxById(id),
    enabled: !!id,
  });
};

export const useMailboxReports = (id: string | number) => {
  return useQuery({
    queryKey: ["mailboxes", "reports", id],
    queryFn: () => mailboxApi.getMailboxReports(id),
    enabled: !!id,
  });
};

// --- Mutations ---
export const useMailboxOperations = () => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["mailboxes"] });

  const deleteMutation = useMutation({
    mutationFn: mailboxApi.deleteMailbox,
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
    mutationFn: mailboxApi.syncMailbox,
    onMutate: async (id: string | number) => {
      await queryClient.cancelQueries({ queryKey: ["mailboxes"] });
      const previousMailboxes = queryClient.getQueryData<any[]>(["mailboxes"]);

      if (previousMailboxes) {
        queryClient.setQueryData(
          ["mailboxes"],
          previousMailboxes.map((mailbox) =>
            mailbox.id === id ? { ...mailbox, status: "syncing" } : mailbox,
          ),
        );
      }

      return { previousMailboxes };
    },
    onSuccess: () => {
      toast.success("Mailbox Synced Successfully");
    },
    onError: (error: any, _id, context) => {
      if (context?.previousMailboxes) {
        queryClient.setQueryData(["mailboxes"], context.previousMailboxes);
      }
      toast.error(error?.message || "Failed to sync mailbox");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) =>
      mailboxApi.updateMailbox(id, data),
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
    isSyncing: syncMutation.isPending,
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
