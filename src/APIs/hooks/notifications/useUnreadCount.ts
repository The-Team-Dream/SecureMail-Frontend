import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "../../features/notifications";

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: notificationsApi.getUnreadCount,
  });
};
