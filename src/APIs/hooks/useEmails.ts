import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { emailsApi } from '../features/emails';
import toast from 'react-hot-toast';

export const useEmails = (mailboxId: string, folder: string, page: number) => {
  return useQuery({
    queryKey: ['emails', mailboxId, folder, page],
    queryFn: () => emailsApi.getEmails(mailboxId, folder, page),
    staleTime: 5 * 60 * 1000,
    enabled: !!mailboxId && !!folder,
  });
};

export const useEmailDetails = (mailboxId: string, emailId: string) => {
  return useQuery({
    queryKey: ['email', emailId],
    queryFn: () => emailsApi.getEmailDetails(mailboxId, emailId),
    enabled: !!emailId,
  });
};

export const useEmailActions = (mailboxId: string) => {
  const queryClient = useQueryClient();

  const readMutation = useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) => 
      emailsApi.markAsRead(mailboxId, id, read),
    onMutate: async ({ id, read }) => {
      await queryClient.cancelQueries({ queryKey: ['emails', mailboxId] });
      const previousEmails = queryClient.getQueryData(['emails', mailboxId]);
      return { previousEmails };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['emails', mailboxId] });
    },
  });

  // Reclassify / Move Email
  const reclassifyMutation = useMutation({
    mutationFn: ({ id, folder }: { id: string; folder: string }) => 
      emailsApi.reclassify(mailboxId, id, folder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails', mailboxId] });
      toast.success("Email moved successfully");
    },
  });

  // Delete Email
  const deleteMutation = useMutation({
    mutationFn: (id: string) => emailsApi.deleteEmail(mailboxId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails', mailboxId] });
    },
  });

  // Compose / Reply / Forward Mutations
  const sendMutation = useMutation({
    mutationFn: (formData: FormData) => emailsApi.sendEmail(mailboxId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails', mailboxId] });
      toast.success("Email sent successfully");
    },
    onError: () => toast.error("Failed to send email"),
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => 
      emailsApi.replyEmail(mailboxId, id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails', mailboxId] });
      toast.success("Reply sent successfully");
    },
    onError: () => toast.error("Failed to send reply"),
  });

  const forwardMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => 
      emailsApi.forwardEmail(mailboxId, id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails', mailboxId] });
      toast.success("Email forwarded successfully");
    },
    onError: () => toast.error("Failed to forward email"),
  });

  return { 
    readMutation, 
    reclassifyMutation, 
    deleteMutation,
    sendMutation,
    replyMutation,
    forwardMutation
  };
};