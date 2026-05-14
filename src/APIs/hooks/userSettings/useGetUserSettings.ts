import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "../../features/userSettings";

export const useGetUserSettings = () => {
  return useQuery({
    queryKey: ["user-settings"],
    queryFn: settingsApi.getSettings,
    // Normalize the backend shape: { user, settings } → flat UserSettings object
    select: (data: any) => {
      if (data?.settings) {
        return {
          ...data.settings,
          username: data.user?.username,
          email: data.user?.email,
          avatarUrl: data.user?.avatar ?? null,
          isTwoFactorEnabled: data.user?.totpEnabled ?? false,
        };
      }
      // Already flat (e.g. from optimistic update)
      return data;
    },
  });
};
