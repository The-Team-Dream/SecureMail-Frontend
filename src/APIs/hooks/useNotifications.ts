import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../features/notifications';
import { toast } from 'react-hot-toast';


export const useNotifications = (page = 1) => {
  return useQuery({
    queryKey: ['notifications', page],
    queryFn: () => notificationsApi.getNotifications(page),
    refetchInterval: 10000,
    staleTime: 0,
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: notificationsApi.getUnreadCount,
    refetchInterval: 10000,
    staleTime: 0,
  });
};

export const useNotificationOperations = () => {
  const queryClient = useQueryClient();

  const readMutation = useMutation({
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

      // Update notifications in cache optimistically
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
    onError: (err, id, context: any) => {
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

  const readAllMutation = useMutation({
    mutationFn: notificationsApi.readAllNotifications,
    onMutate: async () => {
      queryClient.setQueryData(['notifications', 'unread-count'], { count: 0 });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
    onSuccess: () => {
      toast.success("All notifications marked as read");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: notificationsApi.deleteNotification,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousNotifications = queryClient.getQueryData<any>(["notifications"]);

      queryClient.setQueryData(["notifications"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((n: any) => n.id !== id),
        };
      });

      return { previousNotifications };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onSuccess: () => {
      toast.success("Notification deleted");
    },
  });

  return {
    readNotification: readMutation.mutate,
    readAll: readAllMutation.mutate,
    deleteNotification: deleteMutation.mutate,
  };
};