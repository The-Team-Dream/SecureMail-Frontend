import axiosInstance from "@/lib/axios";
import { unwrap } from "../utils";

export interface ScanProgress {
  total: number;
  completed: number;
  pending: number;
  percentage: number;
  isScanning: boolean;
}

export const getScanProgress = async (mailboxId: string): Promise<ScanProgress> => {
  const response = await axiosInstance.get(`/mailboxes/${mailboxId}/scan-progress`);
  return unwrap(response);
};
