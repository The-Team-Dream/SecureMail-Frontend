import axiosInstance from "@/lib/axios";
import { unwrap } from "../utils";
import type { EmailDetails } from "../../types/Email";

export const getEmailDetails = async (
  mailboxId: string,
  emailId: string,
): Promise<EmailDetails> => {
  const res = await axiosInstance.get<EmailDetails>(
    `/mailboxes/${mailboxId}/emails/${emailId}`,
  );
  return unwrap(res);
};
