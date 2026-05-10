import { useQuery } from "@tanstack/react-query";
import { sessionsApi } from "../../features/sessions";

export const useSessions = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: sessionsApi.getSessions,
  });
};
