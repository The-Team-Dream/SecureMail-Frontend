import axiosInstance from "@/lib/axios";
import { unwrap } from "../utils";

export const replyEmail = async (
  mailboxId: string,
  emailId: string,
  formData: FormData,
): Promise<{ id: string }> => {
  const res = await axiosInstance.post(
    `/mailboxes/${mailboxId}/emails/${emailId}/reply`,
    formData,
  );
  return unwrap(res);
};
