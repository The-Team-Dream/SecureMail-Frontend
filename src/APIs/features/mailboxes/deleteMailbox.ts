import axiosInstance from "@/lib/axios";
import { Mailbox } from "../../types/Mailbox";
import { unwrap } from "../utils";

export const deleteMailbox = async (id: number): Promise<Mailbox> => {
  return unwrap(await axiosInstance.delete(`/mailboxes/${id}`));
};
