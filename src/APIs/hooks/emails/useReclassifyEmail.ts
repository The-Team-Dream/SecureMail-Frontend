import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailsApi } from "../../features/emails";
import { toast } from "sonner";
import type { EmailFolder } from "../../types/Email";

export const useReclassifyEmail = (mailboxId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, folder }: { id: string; folder: EmailFolder }) =>
      emailsApi.reclassify(mailboxId, id, folder),
    onMutate: async ({ id, folder }) => {
      await queryClient.cancelQueries({ queryKey: ["emails", mailboxId] });
      const previousQueries = queryClient.getQueriesData<any>({
        queryKey: ["emails", mailboxId],
      });

      queryClient.setQueriesData<any>(
        { queryKey: ["emails", mailboxId, folder] },
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
      toast.success("Email reclassified successfully");
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: ["mailboxes", "reports", mailboxId] });
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
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: ["mailboxes", "reports", mailboxId] });
    },
  });
};
