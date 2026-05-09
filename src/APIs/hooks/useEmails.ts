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

export const useSearchEmails = (mailboxId: string, q: string, page: number) => {
  return useQuery({
    queryKey: ["emails", "search", mailboxId, q, page],
    queryFn: () => emailsApi.searchEmails(mailboxId, q, page),
    staleTime: 5 * 60 * 1000,
    enabled: !!mailboxId && !!q,
  });
};

export const useEmailDetails = (mailboxId: string, emailId: string) => {
  return useQuery({
    queryKey: ["email", emailId],
    queryFn: () => emailsApi.getEmailDetails(mailboxId, emailId),
    staleTime: 5 * 60 * 1000,
    enabled: !!emailId,
  });
};

export const useUnreadEmailsCount = (
  mailboxId: string,
  folder: EmailFolder = "inbox",
) => {
  const queryClient = useQueryClient();
  // Get all cached pages for this folder
  const queries = queryClient.getQueriesData<any>({
    queryKey: ["emails", mailboxId, folder],
  });

  let count = 0;
  queries.forEach(([_, data]) => {
    if (data && data.data && Array.isArray(data.data)) {
      count += data.data.filter((e: any) => !e.isRead).length;
    }
  });
  return count;
};

export const useEmailActions = (
  mailboxId: string,
  currentFolder?: EmailFolder,
) => {
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
              String(email.id) === String(id) ? { ...email, isRead: read } : email,
            ),
          };
        },
      );

      // Also update detail view if open
      const previousDetail = queryClient.getQueryData(["email", id]);
      queryClient.setQueryData(["email", id], (old: any) =>
        old ? { ...old, isRead: read } : old,
      );

      toast.success(read ? "Email marked as read" : "Email marked as unread");

      return { previousQueries, previousDetail };
    },
    onError: (err: any, { id }, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(["email", id], context.previousDetail);
      }
      toast.error(
        err.response?.data?.message || "Failed to update read status",
      );
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
    mutationFn: (id: string) => {
      if (currentFolder === "trash") {
        return emailsApi.deleteEmail(mailboxId, id);
      }
      return emailsApi.reclassify(mailboxId, id, "trash");
    },
    onMutate: async (id) => {
      console.log("Starting delete mutation for email ID:", id);
      await queryClient.cancelQueries({ queryKey: ["emails", mailboxId] });
      const previousQueries = queryClient.getQueriesData<any>({
        queryKey: ["emails", mailboxId],
      });

      const queries = queryClient.getQueriesData<any>({
        queryKey: ["emails", mailboxId],
      });

      queries.forEach(([queryKey, old]) => {
        if (!old) return;
        const folder = queryKey[2];

        if (folder === "trash") {
          // Find the email in previous queries to add it to trash
          const emailToTrash = previousQueries
            .map(([_, data]) =>
              data?.data?.find((e: any) => String(e.id) === String(id)),
            )
            .find(Boolean);

          if (emailToTrash) {
            queryClient.setQueryData(queryKey, {
              ...old,
              data: [
                emailToTrash,
                ...old.data.filter((e: any) => String(e.id) !== String(id)),
              ],
            });
          }
        } else {
          // Remove from other folders
          queryClient.setQueryData(queryKey, {
            ...old,
            data: old.data.filter(
              (email: any) => String(email.id) !== String(id),
            ),
          });
        }
      });

      return { previousQueries };
    },
    onSuccess: (data) => {
      console.log("Delete mutation successful:", data);
      toast.success("Email deleted successfully");
    },
    onError: (err: any, id, context) => {
      console.error("Delete mutation failed for ID:", id, "Error:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to delete email";
      toast.error(errorMessage);

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
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Failed to send email"),
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      emailsApi.replyEmail(mailboxId, id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", mailboxId] });
      toast.success("Reply sent successfully");
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Failed to send reply"),
  });

  const forwardMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      emailsApi.forwardEmail(mailboxId, id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", mailboxId] });
      toast.success("Email forwarded successfully");
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Failed to forward email"),
  });

  const starMutation = useMutation({
    mutationFn: ({ id, starred }: { id: string; starred: boolean }) =>
      emailsApi.starEmail(mailboxId, id, starred),
    onMutate: async ({ id, starred }) => {
      await queryClient.cancelQueries({ queryKey: ["emails", mailboxId] });
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
              String(email.id) === String(id) ? { ...email, isFlagged: starred } : email,
            ),
          };
        },
      );

      return { previousQueries };
    },
    onError: (err: any, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(err.response?.data?.message || "Failed to star email");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", mailboxId] });
    },
  });

  const reportMutation = useMutation({
    mutationFn: ({ id, type }: { id: string; type: "spam" | "phishing" }) =>
      emailsApi.reportEmail(mailboxId, id, type),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["emails", mailboxId] });
      const previousQueries = queryClient.getQueriesData<any>({
        queryKey: ["emails", mailboxId],
      });

      // Remove from current view optimistically
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
    onSuccess: (_, { type }) => {
      toast.success(`Email reported as ${type}`);
    },
    onError: (err: any, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(err.response?.data?.message || "Failed to report email");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", mailboxId] });
    },
  });

  return {
    readMutation,
    reclassifyMutation,
    deleteMutation,
    sendMutation,
    replyMutation,
    forwardMutation,
    starMutation,
    reportMutation,
  };
};
