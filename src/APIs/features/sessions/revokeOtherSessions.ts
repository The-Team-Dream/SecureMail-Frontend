import axiosInstance from "@/lib/axios";
import { UserSession } from "@/APIs/types/Session";

export const revokeOtherSessions = async (): Promise<UserSession> => {
  const res = await axiosInstance.delete("/sessions");
  return res.data;
};
