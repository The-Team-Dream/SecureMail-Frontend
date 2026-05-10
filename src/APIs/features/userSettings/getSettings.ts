import axiosInstance from "@/lib/axios";
import { UserSettings } from "../../types/UserSettings";

export const getSettings = async (): Promise<UserSettings> => {
  const res = await axiosInstance.get<{ data?: UserSettings } & UserSettings>(
    "/user-settings",
  );
  return res.data?.data ?? res.data;
};
