import axiosInstance from "@/lib/axios";
import { unwrap } from "../utils";

export interface QueueJob {
  jobId: string;
  emailId: number;
  messageId: string;
  addedAt: string;
  progress?: number;
}

export interface QueueStatus {
  active: QueueJob[];
  waiting: QueueJob[];
  activeCount: number;
  waitingCount: number;
  isPaused: boolean;
}

export const getQueueStatus = async (mailboxId: string): Promise<QueueStatus> => {
  const response = await axiosInstance.get(`/mailboxes/${mailboxId}/scan-queue`);
  return unwrap(response);
};

export const controlQueue = async (
  mailboxId: string,
  action: "pause" | "resume" | "clear"
): Promise<{ message: string }> => {
  const response = await axiosInstance.post(`/mailboxes/${mailboxId}/scan-queue/control`, { action });
  return unwrap(response);
};

export const cancelScanJob = async (
  mailboxId: string,
  emailId: number
): Promise<{ message: string; emailId: number }> => {
  const response = await axiosInstance.delete(`/mailboxes/${mailboxId}/scan-queue/${emailId}`);
  return unwrap(response);
};
