import axiosInstance from "@/lib/axios";
import { Mailbox } from "../../types/Mailbox";
import { unwrap } from "../utils";

export const connectGmail = async (
  code: string,
  redirectUri: string,
): Promise<Mailbox> => {
  const res = await axiosInstance.post("/mailboxes/gmail", {
    code,
    redirectUri,
  });
  return unwrap(res);
};
