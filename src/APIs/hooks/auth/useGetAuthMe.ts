import { useQuery } from "@tanstack/react-query";
import { getAuthMe } from "../../features/auth";

export const useGetAuthMe = () => {
  return useQuery({
    queryKey: ["auth-me"],
    queryFn: () => getAuthMe(),
    staleTime: 10 * 60 * 1000, // 10 min - user profile rarely changes
  });
};
