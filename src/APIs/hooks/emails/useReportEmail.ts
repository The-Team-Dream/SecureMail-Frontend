import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailsApi } from "../../features/emails";
import { toast } from "sonner";

export const useReportEmail = (mailboxId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: "spam" | "phishing" | "malware" }) =>
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
};

