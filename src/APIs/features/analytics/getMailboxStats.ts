import axiosInstance from "@/lib/axios";
import { MailboxStats } from "../../types/Analytics";
import { unwrap } from "../utils";

export const getMailboxStats = async (
  mailboxId: string,
): Promise<MailboxStats> => {
  const res = await axiosInstance.get<MailboxStats>(`/analytics/mailboxes/${mailboxId}`);
  return unwrap(res);
};
