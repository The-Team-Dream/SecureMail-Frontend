import axiosInstance from "@/lib/axios";
import { UserSettings } from "../../types/UserSettings";

export const enable2FA = async (code: string): Promise<UserSettings> => {
  const res = await axiosInstance.post<UserSettings>(
    "/user-settings/2fa/enable",
    { code },
  );
  return res.data;
};
