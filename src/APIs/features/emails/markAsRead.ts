import axiosInstance from "@/lib/axios";
import { unwrap } from "../utils";

export const markAsRead = async (
  mailboxId: string,
  emailId: string,
  read: boolean,
): Promise<void> => {
  const res = await axiosInstance.patch(
    `/mailboxes/${mailboxId}/emails/${emailId}/read`,
    { read },
  );
  return unwrap(res);
};
