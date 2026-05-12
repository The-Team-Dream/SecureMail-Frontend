import axiosInstance from "@/lib/axios";
import { SecurityReport } from "../../types/Report";
import { unwrap } from "../utils";

export const getMailboxReports = async (
  id: number,
): Promise<SecurityReport[]> => {
  return unwrap(await axiosInstance.get(`/mailboxes/${id}/reports`));
};
