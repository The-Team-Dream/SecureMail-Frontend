import axiosInstance from "@/lib/axios";
import { UserSettings } from "../../types/UserSettings";

export const disable2FA = async (code: string): Promise<UserSettings> => {
  const res = await axiosInstance.post<UserSettings>(
    "/user-settings/2fa/disable",
    { code },
  );
  return res.data;
};
