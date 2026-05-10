import axiosInstance from "@/lib/axios";
import { NotificationsResponse } from "../../types/Notification";

export const readOneNotification = async (
  id: string,
): Promise<NotificationsResponse> => {
  const res = await axiosInstance.patch<NotificationsResponse>(
    `/notifications/${id}/read`,
  );
  return res.data;
};
