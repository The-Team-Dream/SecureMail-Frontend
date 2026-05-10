import axiosInstance from "@/lib/axios";
import type { EmailsResponse, EmailFolder } from "../../types/Email";
import { unwrap } from "../utils";

export const getEmails = async (
  mailboxId: string,
  folder: EmailFolder,
  page = 1,
  limit = 20,
): Promise<EmailsResponse> => {
  const res = await axiosInstance.get<EmailsResponse>(
    `/mailboxes/${mailboxId}/${folder}`,
    {
      params: { page, limit },
    },
  );
  return unwrap(res);
};
