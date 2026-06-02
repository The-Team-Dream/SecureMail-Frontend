import { useQuery } from "@tanstack/react-query";
import { getReports } from "@/APIs/features/reports/reports";

export const useReports = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
  });
};
