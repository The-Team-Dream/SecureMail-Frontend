import axiosInstance from "@/lib/axios";

export const getReports = async (): Promise<any> => {
  const res = await axiosInstance.get<any>("/reports");
  const data = res.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.reports)) return data.data.reports;
  if (Array.isArray(data?.reports)) return data.reports;
  return [];
};
