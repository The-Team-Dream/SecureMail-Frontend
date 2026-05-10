import axiosInstance from "@/lib/axios";
import { UserSettings } from "../../types/UserSettings";

export const updateNotifications = async (
  notifications: boolean,
): Promise<UserSettings> => {
  const res = await axiosInstance.patch<{ data?: UserSettings } & UserSettings>(
    "/user-settings/notifications",
    { notificationsEnabled: notifications },
  );
  return res.data?.data ?? res.data;
};
