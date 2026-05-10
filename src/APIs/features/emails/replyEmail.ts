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
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return unwrap(res);
};
