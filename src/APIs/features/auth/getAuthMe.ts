import axiosInstance from "@/lib/axios";

export const getAuthMe = async () => {
  const res = await axiosInstance.get("/user/profile");
  return res.data?.data;
};
