import axiosInstance from "@/lib/axios";
import { UserSession } from "@/APIs/types/Session";

export const revokeSession = async (id: number): Promise<UserSession> => {
  const res = await axiosInstance.delete(`/sessions/${id}`);
  return res.data;
};
