import axiosInstance from "@/lib/axios";
import { NotificationsResponse } from "../../types/Notification";

export const getNotifications = async (
  page = 1,
  limit = 20,
): Promise<NotificationsResponse> => {
  const res = await axiosInstance.get<NotificationsResponse>("/notifications", {
    params: { page, limit },
  });
  return res.data;
};
