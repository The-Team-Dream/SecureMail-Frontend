import axiosInstance from "@/lib/axios";
import { unwrap } from "../utils";
import type { Email } from "../../types/Email";

export const scanEmail = async (
  mailboxId: string,
  emailId: string,
): Promise<Email> => {
  const res = await axiosInstance.post(
    `/mailboxes/${mailboxId}/emails/${emailId}/scan`,
  );
  return unwrap(res);
};
