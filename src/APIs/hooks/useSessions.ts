import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionsApi } from "../features/sessions";
import { UserSession } from "@/APIs/types/Session";
import { toast } from "sonner";

export const useSessions = () => {
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery({
    queryKey: ["sessions"],
    queryFn: sessionsApi.getSessions,
  });

  const revokeMutation = useMutation({
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
    onError: (err, id, context) => {
      if (context?.previousSessions) {
        queryClient.setQueryData(["sessions"], context.previousSessions);
      }
      toast.error("Failed to revoke session");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  const revokeOthersMutation = useMutation({
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
    onError: (err, variables, context) => {
      if (context?.previousSessions) {
        queryClient.setQueryData(["sessions"], context.previousSessions);
      }
    },
    onSettled: () => {  
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  return {
    sessions: sessionsQuery.data ?? [],
    isLoading: sessionsQuery.isLoading,
    isError: sessionsQuery.isError,
    revokeSession: revokeMutation.mutate,
    revokeOthers: revokeOthersMutation.mutate,
  };
};
