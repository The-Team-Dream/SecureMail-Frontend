import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailsApi } from "../../features/emails";
import { toast } from "sonner";
import type { EmailFolder } from "../../types/Email";

export const useDeleteEmail = (mailboxId: string, currentFolder?: EmailFolder) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: string | { id: string; showToast?: boolean }) => {
      const id = typeof args === "string" ? args : args.id;
      if (currentFolder === "trash") {
        return emailsApi.deleteEmail(mailboxId, id);
      }
      return emailsApi.reclassify(mailboxId, id, "trash");
    },
    onMutate: async (args) => {
      const id = typeof args === "string" ? args : args.id;
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
    onSuccess: (_data, args) => {
      const showToast = typeof args === "string" ? true : (args.showToast ?? true);
      if (showToast) {
        toast.success("Email deleted successfully");
      }
    },
    onError: (err: any, args, context) => {
      const showToast = typeof args === "string" ? true : (args.showToast ?? true);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to delete email";
      if (showToast) {
        toast.error(errorMessage);
      }

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
};

