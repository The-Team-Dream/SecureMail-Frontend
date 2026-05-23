import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { emailsApi } from "../../features/emails";
import { QueueStatus } from "../../features/emails/scanQueue";

export const useScanQueueStatus = (mailboxId: string) => {
  return useQuery({
    queryKey: ["scan-queue", mailboxId],
    queryFn: () => emailsApi.getQueueStatus(mailboxId),
    staleTime: 0, // Always re-fetch, never use cached data for queue status
    refetchInterval: (query) => {
      const data = query.state.data as QueueStatus | undefined;
      // If there are active or waiting jobs, refetch every 2 seconds to keep it dynamic and live
      if (data && (data.activeCount > 0 || data.waitingCount > 0)) {
        return 2000;
      }
      return 5000; // otherwise refetch every 5 seconds
    },
    enabled: !!mailboxId,
  });
};

export const useControlScanQueue = (mailboxId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: "pause" | "resume" | "clear") =>
      emailsApi.controlQueue(mailboxId, action),
    // Optimistic update: flip isPaused immediately so the button toggles instantly
    onMutate: async (action) => {
      await queryClient.cancelQueries({ queryKey: ["scan-queue", mailboxId] });
      const previous = queryClient.getQueryData<QueueStatus>(["scan-queue", mailboxId]);
      if (previous && (action === "pause" || action === "resume")) {
        queryClient.setQueryData<QueueStatus>(["scan-queue", mailboxId], {
          ...previous,
          isPaused: action === "pause",
        });
      }
      return { previous };
    },
    // If the mutation fails, roll back to the previous state
    onError: (_err, _action, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["scan-queue", mailboxId], context.previous);
      }
    },
    // After success or error, refetch to confirm real server state
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["scan-queue", mailboxId] });
      queryClient.invalidateQueries({ queryKey: ["scan-progress", mailboxId] });
      queryClient.invalidateQueries({ queryKey: ["emails", mailboxId] });
    },
  });
};

export const useCancelScanJob = (mailboxId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (emailId: number) => emailsApi.cancelScanJob(mailboxId, emailId),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["scan-queue", mailboxId] });
      queryClient.invalidateQueries({ queryKey: ["scan-progress", mailboxId] });
      queryClient.invalidateQueries({ queryKey: ["emails", mailboxId] });
    },
  });
};
