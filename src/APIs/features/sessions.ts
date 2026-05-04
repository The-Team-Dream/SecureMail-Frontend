import axiosInstance from "@/lib/axios";
import { UserSession, GetSessionsResponse } from "@/APIs/types/Session";

export const sessionsApi = {
  getSessions: async (): Promise<UserSession[]> => {
    const res = await axiosInstance.get<GetSessionsResponse>("/sessions");
    const data = res.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.sessions)) return data.data.sessions;
    if (Array.isArray(data?.sessions)) return data.sessions;
    return [];
  },

  // Revoke a specific session
  revokeSession: async (id: number): Promise<UserSession> => {
    const res = await axiosInstance.delete(`/sessions/${id}`);
    return res.data;
  },

  // Revoke all sessions except current
  revokeOtherSessions: async (): Promise<UserSession> => {
    const res = await axiosInstance.delete("/sessions");
    return res.data;
  },
};
