import axiosInstance from "@/lib/axios";
import { UserSession } from "@/APIs/types/Session";

export const sessionsApi = {
  getSessions: async (): Promise<UserSession[]> => {
    const res = await axiosInstance.get<UserSession[]>("/sessions");
    return res.data;
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
