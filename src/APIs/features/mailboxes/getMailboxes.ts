import axiosInstance from "@/lib/axios";
import { Mailbox, Mailboxes } from "../../types/Mailbox";

export const getMailboxes = async (): Promise<Mailbox[]> => {
  const res = await axiosInstance.get<Mailboxes>("/mailboxes");
  const data = res.data;

  if (Array.isArray(data)) return data;

  if ("data" in data) {
    if (Array.isArray(data.data)) return data.data;
    if (
      data.data &&
      "mailboxes" in data.data &&
      Array.isArray(data.data.mailboxes)
    ) {
      return data.data.mailboxes;
    }
  }

  if ("mailboxes" in data && Array.isArray(data.mailboxes)) {
    return data.mailboxes;
  }

  return [];
};
