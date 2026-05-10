import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionsApi } from "../../features/sessions";
import { UserSession } from "@/APIs/types/Session";
import { toast } from "sonner";

export const useRevokeOtherSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionsApi.revokeOtherSessions,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["sessions"] });
      const previousSessions = queryClient.getQueryData<UserSession[]>([
        "sessions",
      ]);

      queryClient.setQueryData<UserSession[]>(["sessions"], (old) =>
        old?.filter((session) => session.isCurrent),
      );

      return { previousSessions };
    },
    onSuccess: () => {
      toast.success("Other sessions revoked successfully");
    },
    onError: (_err, _variables, context) => {
      if (context?.previousSessions) {
        queryClient.setQueryData(["sessions"], context.previousSessions);
      }
      toast.error("Failed to revoke other sessions");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};

