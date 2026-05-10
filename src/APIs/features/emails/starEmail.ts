import axiosInstance from "@/lib/axios";
import { unwrap } from "../utils";

export const starEmail = async (
  mailboxId: string,
  emailId: string,
  starred: boolean,
): Promise<void> => {
  const res = await axiosInstance.put(
    `/mailboxes/${mailboxId}/emails/${emailId}/star`,
    { starred },
  );
  return unwrap(res);
};
