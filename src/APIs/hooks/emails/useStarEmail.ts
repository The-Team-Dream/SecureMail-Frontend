import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailsApi } from "../../features/emails";
import { toast } from "sonner";

export const useStarEmail = (mailboxId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
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
              String(email.id) === String(id)
                ? { ...email, isFlagged: starred }
                : email,
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
};
