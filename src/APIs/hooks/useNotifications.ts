import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../features/notifications';


export const useNotifications = (page = 1) => {
  return useQuery({
    queryKey: ['notifications', page],
    queryFn: () => notificationsApi.getNotifications(page),
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: notificationsApi.getUnreadCount,
    refetchInterval: 30000, 
  });
};

export const useNotificationOperations = () => {
  const queryClient = useQueryClient();

  const readMutation = useMutation({
    mutationFn: notificationsApi.readOneNotification,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      await queryClient.cancelQueries({ queryKey: ['notifications', 'unread-count'] });

      queryClient.setQueryData(['notifications', 'unread-count'], (old: any) => ({
        count: Math.max(0, (old?.count || 0) - 1)
      }));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
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
    }
  });

  return {
    readNotification: readMutation.mutate,
    readAll: readAllMutation.mutate,
  };
};