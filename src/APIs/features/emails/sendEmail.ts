import axiosInstance from "@/lib/axios";
import { unwrap } from "../utils";

export const sendEmail = async (
  mailboxId: string,
  formData: FormData,
): Promise<{ id: string }> => {
  const res = await axiosInstance.post(
    `/mailboxes/${mailboxId}/send`,
    formData,
  );
  return unwrap(res);
};
