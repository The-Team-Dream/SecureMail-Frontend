import axiosInstance from "@/lib/axios";
import { NotificationsResponse } from "../../types/Notification";

export const readAllNotifications = async (): Promise<NotificationsResponse> => {
  const res = await axiosInstance.patch<NotificationsResponse>(
    "/notifications/read-all",
  );
  return res.data;
};
