import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "../../features/notifications";
import { toast } from "sonner";

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.deleteNotification,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousNotifications = queryClient.getQueryData<any>(["notifications"]);

      queryClient.setQueryData(["notifications"], (old: any) => {
        if (!old?.data?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.filter((n: any) => String(n.id) !== id),
          },
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
    onError: (err: any, _id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(["notifications"], context.previousNotifications);
      }
      toast.error(err.response?.data?.message || "Failed to delete notification");
    }
  });
};
