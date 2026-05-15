import { useQuery } from "@tanstack/react-query";
import { systemApi } from "../../features/system";

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ["system", "health"],
    queryFn: systemApi.getHealth,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
