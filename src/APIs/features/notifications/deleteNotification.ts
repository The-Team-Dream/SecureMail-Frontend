import axiosInstance from "@/lib/axios";
import { NotificationsResponse } from "../../types/Notification";

export const deleteNotification = async (
  id: string,
): Promise<NotificationsResponse> => {
  const res = await axiosInstance.delete<NotificationsResponse>(
    `/notifications/${id}`,
  );
  return res.data;
};
