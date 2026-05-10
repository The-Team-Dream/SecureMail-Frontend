import axiosInstance from "@/lib/axios";
import { Mailbox } from "../../types/Mailbox";
import { unwrap } from "../utils";

export const getMailboxById = async (id: number): Promise<Mailbox> => {
  return unwrap(await axiosInstance.get(`/mailboxes/${id}`));
};
