import axiosInstance from "@/lib/axios";
import { unwrap } from "../utils";

export const deleteEmail = async (mailboxId: string, emailId: string): Promise<void> => {
  const res = await axiosInstance.delete(
    `/mailboxes/${mailboxId}/emails/${emailId}`,
  );
  return unwrap(res);
};
