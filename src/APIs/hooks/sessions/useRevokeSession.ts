import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionsApi } from "../../features/sessions";
import { UserSession } from "@/APIs/types/Session";
import { toast } from "sonner";

export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sessionsApi.revokeSession(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["sessions"] });

      const previousSessions = queryClient.getQueryData<UserSession[]>([
        "sessions",
      ]);

      queryClient.setQueryData<UserSession[]>(["sessions"], (old) =>
        old?.filter((session) => session.id !== id),
      );

      return { previousSessions };
    },
    onError: (_err, _id, context) => {
      if (context?.previousSessions) {
        queryClient.setQueryData(["sessions"], context.previousSessions);
      }
      toast.error("Failed to revoke session");
    },
    onSuccess: () => {
      toast.success("Session revoked successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};

