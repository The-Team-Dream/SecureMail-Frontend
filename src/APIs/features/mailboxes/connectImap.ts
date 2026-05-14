import axiosInstance from "@/lib/axios";
import { IMAPConfig, Mailbox } from "../../types/Mailbox";
import { unwrap } from "../utils";
import { imapConfigSchema } from "@/schemas/CustomAccount";

export const connectImap = async (raw: IMAPConfig): Promise<Mailbox> => {
  const payload = imapConfigSchema.parse(raw);

  const res = await axiosInstance.post("/mailboxes/imap", payload);
  return unwrap(res);
};
