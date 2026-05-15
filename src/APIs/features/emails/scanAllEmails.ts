import axiosInstance from "@/lib/axios";
import { unwrap } from "../utils";

export const scanAllEmails = async (
  mailboxId: string,
): Promise<any> => {
  const res = await axiosInstance.post(
    `/mailboxes/${mailboxId}/scan-all`,
  );
  return unwrap(res);
};
