import axiosInstance from "@/lib/axios";
import { Mailbox } from "../../types/Mailbox";
import { unwrap } from "../utils";

export const syncMailbox = async (id: number): Promise<Mailbox> => {
  return unwrap(await axiosInstance.post(`/mailboxes/${id}/sync`));
};
