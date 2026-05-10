import axiosInstance from "@/lib/axios";
import { unwrap } from "../utils";
import type { EmailsResponse } from "../../types/Email";

export const searchEmails = async (
  mailboxId: string,
  q: string,
  page = 1,
  limit = 20,
): Promise<EmailsResponse> => {
  const res = await axiosInstance.get<EmailsResponse>(
    `/mailboxes/${mailboxId}/search`,
    { params: { q, page, limit } },
  );
  return unwrap(res);
};
