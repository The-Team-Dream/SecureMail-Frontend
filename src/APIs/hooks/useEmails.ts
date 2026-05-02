import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { emailsApi } from "../features/emails";
import toast from "react-hot-toast";
import type { EmailFolder } from "../types/Email";

export const useEmails = (
  mailboxId: string,
  folder: EmailFolder,
  page: number,
) => {
  return useQuery({
    queryKey: ["emails", mailboxId, folder, page],
    queryFn: () => emailsApi.getEmails(mailboxId, folder, page),
    staleTime: 5 * 60 * 1000,
    enabled: !!mailboxId && !!folder,
  });
};

export const useEmailDetails = (mailboxId: string, emailId: string) => {
  return useQuery({
    queryKey: ["email", emailId],
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
      await queryClient.cancelQueries({ queryKey: ["emails", mailboxId] });
      await queryClient.cancelQueries({ queryKey: ["email", id] });

      const previousQueries = queryClient.getQueriesData<any>({
        queryKey: ["emails", mailboxId],
      });

      queryClient.setQueriesData<any>(
        { queryKey: ["emails", mailboxId] },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((email: any) =>
              email.id === id ? { ...email, read } : email,
            ),
          };
        },
      );

      // Also update detail view if open
      const previousDetail = queryClient.getQueryData(["email", id]);
      queryClient.setQueryData(["email", id], (old: any) =>
        old ? { ...old, read } : old,
      );

      return { previousQueries, previousDetail };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(["email", id], context.previousDetail);
      }
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["emails", mailboxId] });
      queryClient.invalidateQueries({ queryKey: ["email", id] });
    },
  });

  // Reclassify / Move Email
  const reclassifyMutation = useMutation({
    mutationFn: ({ id, folder }: { id: string; folder: EmailFolder }) =>
      emailsApi.reclassify(mailboxId, id, folder),
    onMutate: async ({ id, folder }) => {
      await queryClient.cancelQueries({ queryKey: ["emails", mailboxId] });
      const previousQueries = queryClient.getQueriesData<any>({
        queryKey: ["emails", mailboxId],
      });

      // Remove from current folder list
      queryClient.setQueriesData<any>(
        { queryKey: ["emails", mailboxId] },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((email: any) => email.id !== id),
          };
        },
      );

      return { previousQueries };
    },
    onSuccess: () => {
      toast.success("Email moved successfully");
    },
    onError: (_err, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", mailboxId] });
    },
  });

  // Delete Email
  const deleteMutation = useMutation({
    mutationFn: (id: string) => emailsApi.deleteEmail(mailboxId, id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["emails", mailboxId] });
      const previousQueries = queryClient.getQueriesData<any>({
        queryKey: ["emails", mailboxId],
      });

      // Optimistically remove from current list
      queryClient.setQueriesData<any>(
        { queryKey: ["emails", mailboxId] },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((email: any) => email.id !== id),
          };
        },
      );

      return { previousQueries };
    },
    onSuccess: () => {
      toast.success("Email deleted successfully");
    },
    onError: (_err, _id, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", mailboxId] });
    },
  });

  // Compose / Reply / Forward Mutations
  const sendMutation = useMutation({
    mutationFn: (formData: FormData) =>
      emailsApi.sendEmail(mailboxId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", mailboxId] });
      toast.success("Email sent successfully");
    },
    onError: () => toast.error("Failed to send email"),
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      emailsApi.replyEmail(mailboxId, id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", mailboxId] });
      toast.success("Reply sent successfully");
    },
    onError: () => toast.error("Failed to send reply"),
  });

  const forwardMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      emailsApi.forwardEmail(mailboxId, id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", mailboxId] });
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
    forwardMutation,
  };
};
