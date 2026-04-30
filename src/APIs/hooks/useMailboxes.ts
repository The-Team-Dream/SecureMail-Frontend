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
    onSuccess: invalidate,
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete mailbox");
    },
  });

  const syncMutation = useMutation({
    mutationFn: mailboxApi.syncMailbox,
    onSuccess: () => { 
        toast.success("Mailbox Synced Successfully")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to sync mailbox");
    },
  });

  return { 
    deleteMailbox: deleteMutation.mutate, 
    isDeleting: deleteMutation.isPending,
    syncMailbox: syncMutation.mutate,
    isSyncing: syncMutation.isPending
  };
};