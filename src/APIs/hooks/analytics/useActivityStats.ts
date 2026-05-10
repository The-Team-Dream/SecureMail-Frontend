import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../../features/analytics";

export const useActivityStats = (
  period: "daily" | "weekly" | "monthly" = "daily",
) => {
  return useQuery({
    queryKey: ["analytics", "activity", period],
    queryFn: () => analyticsApi.getActivity(period),
    placeholderData: (previousData) => previousData,
  });
};
