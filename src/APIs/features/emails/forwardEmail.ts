import axiosInstance from "@/lib/axios";
import { unwrap } from "../utils";

export const forwardEmail = async (
  mailboxId: string,
  emailId: string,
  formData: FormData,
): Promise<{ id: string }> => {
  const res = await axiosInstance.post(
    `/mailboxes/${mailboxId}/emails/${emailId}/forward`,
    formData,
  );
  return unwrap(res);
};
