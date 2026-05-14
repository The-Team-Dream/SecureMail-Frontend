import axiosInstance from "@/lib/axios";
import { ActivityData, ActivityPeriod } from "../../types/Analytics";
import { unwrap } from "../utils";

export const getActivity = async (
  period: ActivityPeriod = "daily",
): Promise<ActivityData[]> => {
  const res = await axiosInstance.get<ActivityData[]>("/analytics/activity", {
    params: { period },
  });
  return unwrap(res);
};
