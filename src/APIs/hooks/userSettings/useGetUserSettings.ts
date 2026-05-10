import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "../../features/userSettings";

export const useGetUserSettings = () => {
  return useQuery({
    queryKey: ["user-settings"],
    queryFn: settingsApi.getSettings,
  });
};
