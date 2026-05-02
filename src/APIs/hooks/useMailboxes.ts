import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { mailboxApi } from "../features/mailboxes"
import toast from 'react-hot-toast';

export const useMailboxes = () => {
  return useQuery({
    queryKey: ['mailboxes'],
    queryFn: mailboxApi.getMailboxes,
  });
};

export const useMailboxReports = (id: string) => {
  return useQuery({
    queryKey: ['mailboxes', 'reports', id],
    queryFn: () => mailboxApi.getMailboxReports(id),
    enabled: !!id,
  });
};

// --- Mutations ---
export const useMailboxOperations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['mailboxes'] });

  const deleteMutation = useMutation({
    mutationFn: mailboxApi.deleteMailbox,
    onMutate: async (id: string) => {
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
    onMutate: async (id: string) => {
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

  return { 
    deleteMailbox: deleteMutation.mutate, 
    isDeleting: deleteMutation.isPending,
    syncMailbox: syncMutation.mutate,
    isSyncing: syncMutation.isPending
  };
};