import axiosInstance from "@/lib/axios";
import { unwrap } from "../utils";

export const scanEmail = async (
  mailboxId: string,
  emailId: string,
): Promise<any> => {
  const res = await axiosInstance.post(
    `/mailboxes/${mailboxId}/emails/${emailId}/scan`,
  );
  return unwrap(res);
};
