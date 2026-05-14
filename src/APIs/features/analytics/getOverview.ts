import axiosInstance from "@/lib/axios";
import { AnalyticsOverview } from "../../types/Analytics";
import { unwrap } from "../utils";

export const getOverview = async (): Promise<AnalyticsOverview> => {
  const res = await axiosInstance.get<AnalyticsOverview>("/analytics/overview");
  return unwrap(res);
};
