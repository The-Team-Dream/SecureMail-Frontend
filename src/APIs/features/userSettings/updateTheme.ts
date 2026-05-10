import axiosInstance from "@/lib/axios";
import { UserSettings } from "../../types/UserSettings";

export const updateTheme = async (
  themeMode: "LIGHT" | "DARK",
): Promise<UserSettings> => {
  const res = await axiosInstance.patch<UserSettings>("/user-settings/theme", {
    themeMode,
  });
  return res.data;
};
