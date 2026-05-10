import axiosInstance from "@/lib/axios";
import { unwrap } from "../utils";

export const reportEmail = async (
  mailboxId: string,
  emailId: string,
  type: "spam" | "phishing" | "malware",
): Promise<void> => {
  const res = await axiosInstance.post(
    `/mailboxes/${mailboxId}/emails/${emailId}/report`,
    { type },
  );
  return unwrap(res);
};
