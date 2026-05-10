import axiosInstance from "@/lib/axios";
import { UserSession, GetSessionsResponse } from "@/APIs/types/Session";

export const getSessions = async (): Promise<UserSession[]> => {
  const res = await axiosInstance.get<GetSessionsResponse>("/sessions");
  const data = res.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.sessions)) return data.data.sessions;
  if (Array.isArray(data?.sessions)) return data.sessions;
  return [];
};
