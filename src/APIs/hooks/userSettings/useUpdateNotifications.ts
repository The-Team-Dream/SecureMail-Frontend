import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "../../features/userSettings";
import { toast } from "sonner";

export const useUpdateNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.updateNotifications,
    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({ queryKey: ["user-settings"] });
      const previousSettings = queryClient.getQueryData(["user-settings"]);

      queryClient.setQueryData(["user-settings"], (old: any) => {
        if (!old) return old;
        return { ...old, notificationsEnabled: newStatus };
      });

      return { previousSettings };
    },
    onSuccess: (data) => {
      const status = data?.notificationsEnabled ? "enabled" : "disabled";
      toast.success(`Notifications ${status}`);

      queryClient.setQueryData(["user-settings"], (old: any) => {
        if (!old) return data;
        return { ...old, ...data };
      });
    },
    onError: (err: any, _newStatus, context) => {
      queryClient.setQueryData(["user-settings"], context?.previousSettings);
      toast.error(err.response?.data?.message || "Failed to update notifications");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings"] });
    },
  });
};
