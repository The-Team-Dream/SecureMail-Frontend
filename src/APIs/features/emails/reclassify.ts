import axiosInstance from "@/lib/axios";
import { unwrap } from "../utils";
import type { EmailFolder } from "../../types/Email";

export const reclassify = async (
  mailboxId: string,
  emailId: string,
  folder: EmailFolder,
): Promise<void> => {
  const res = await axiosInstance.patch(
    `/mailboxes/${mailboxId}/emails/${emailId}/reclassify`,
    { folder },
  );
  return unwrap(res);
};
