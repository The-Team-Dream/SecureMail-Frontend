import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "../../features/notifications";
import { toast } from "sonner";

export const useReadAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.readAllNotifications,
    onMutate: async () => {
      queryClient.setQueryData(["notifications", "unread-count"], { count: 0 });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
    onSuccess: () => {
      toast.success("All notifications marked as read");
    }
  });
};

