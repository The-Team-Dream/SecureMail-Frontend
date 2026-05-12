import axiosInstance from "@/lib/axios";

export const logout = async (): Promise<{
  message: string;
}> => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};
