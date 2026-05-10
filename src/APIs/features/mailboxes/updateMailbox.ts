import axiosInstance from "@/lib/axios";
import { Mailbox } from "../../types/Mailbox";
import { unwrap } from "../utils";

export const updateMailbox = async (
  id: number,
  data: Partial<Mailbox>,
): Promise<Mailbox> => {
  return unwrap(await axiosInstance.patch(`/mailboxes/${id}`, data));
};
