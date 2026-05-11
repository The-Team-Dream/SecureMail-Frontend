import { useQuery } from "@tanstack/react-query";
import { getAuthMe } from "../../features/auth";

export const useGetAuthMe = () => {
  return useQuery({
    queryKey: ["auth-me"],
    queryFn: () => getAuthMe(),
  });
};
