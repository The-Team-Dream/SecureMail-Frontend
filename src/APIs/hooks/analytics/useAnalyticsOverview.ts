import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../../features/analytics";

export const useAnalyticsOverview = () => {
  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: analyticsApi.getOverview,
  });
};
