import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailsApi } from "../../features/emails";
import { toast } from "sonner";

export const useReadEmail = (mailboxId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      read,
    }: {
      id: string;
      read: boolean;
      showToast?: boolean;
    }) => emailsApi.markAsRead(mailboxId, id, read),
    onMutate: async ({ id, read, showToast = true }) => {
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
              String(email.id) === String(id)
                ? { ...email, isRead: read }
                : email,
            ),
          };
        },
      );

      const previousDetail = queryClient.getQueryData(["email", id]);
      queryClient.setQueryData(["email", id], (old: any) =>
        old ? { ...old, isRead: read } : old,
      );

      if (showToast) {
        toast.success(read ? "Email marked as read" : "Email marked as unread");
      }

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
};
