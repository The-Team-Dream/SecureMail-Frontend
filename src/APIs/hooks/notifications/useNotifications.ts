import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "../../features/notifications";

export const useNotifications = (page = 1) => {
  return useQuery({
    queryKey: ["notifications", page],
    queryFn: () => notificationsApi.getNotifications(page),
  });
};
