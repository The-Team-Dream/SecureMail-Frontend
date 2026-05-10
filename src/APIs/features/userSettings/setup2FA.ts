import axiosInstance from "@/lib/axios";
import { UserSettings } from "../../types/UserSettings";

export const setup2FA = async (): Promise<UserSettings> => {
  const res = await axiosInstance.post<UserSettings>("/user-settings/2fa/setup");
  return res.data;
};
