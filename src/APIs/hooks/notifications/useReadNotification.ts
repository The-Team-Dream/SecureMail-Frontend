import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "../../features/notifications";
import { toast } from "sonner";

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.readOneNotification,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      await queryClient.cancelQueries({
        queryKey: ["notifications", "unread-count"],
      });

      const previousUnread = queryClient.getQueryData(["notifications", "unread-count"]);
      const previousNotifications = queryClient.getQueryData(["notifications"]);

      queryClient.setQueryData(["notifications", "unread-count"], (old: any) => ({
        count: Math.max(0, (old?.count || 0) - 1),
      }));

      queryClient.setQueriesData({ queryKey: ["notifications"] }, (old: any) => {
        if (!old?.data?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map((n: any) =>
              String(n.id) === id ? { ...n, isRead: true } : n,
            ),
          },
        };
      });

      return { previousUnread, previousNotifications };
    },
    onError: (_err, _id, context: any) => {
      if (context?.previousUnread) {
        queryClient.setQueryData(["notifications", "unread-count"], context.previousUnread);
      }
      if (context?.previousNotifications) {
        queryClient.setQueryData(["notifications"], context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
    onSuccess: () => {
      toast.success("Marked as read");
    }
  });
};

