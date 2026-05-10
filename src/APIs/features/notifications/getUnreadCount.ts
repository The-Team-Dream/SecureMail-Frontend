import axiosInstance from "@/lib/axios";

export const getUnreadCount = async (): Promise<{ count: number }> => {
  const res = await axiosInstance.get<any>("/notifications/unread-count");
  let count = 0;
  if (typeof res.data === "number") {
    count = res.data;
  } else if (res.data?.data !== undefined) {
    count =
      typeof res.data.data === "number" ? res.data.data : res.data.data.count;
  } else if (res.data?.count !== undefined) {
    count = res.data.count;
  }

  return { count: Number(count) || 0 };
};
