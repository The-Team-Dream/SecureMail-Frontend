import axiosInstance from "@/lib/axios";
import { IMAPConfig, Mailbox } from "../../types/Mailbox";
import { unwrap } from "../utils";

export const connectImap = async (raw: IMAPConfig): Promise<Mailbox> => {
  const port = Number(raw.port);
  const smtpPort = raw.smtpPort !== undefined ? Number(raw.smtpPort) : undefined;

  if (!raw.host?.trim()) throw new Error("IMAP host is required.");
  if (isNaN(port) || port < 1 || port > 65535)
    throw new Error("IMAP port must be between 1–65535.");
  if (!raw.email?.trim()) throw new Error("Email is required.");
  if (!raw.password?.trim()) throw new Error("Password is required.");
  if (!raw.displayName?.trim()) throw new Error("Display name is required.");

  const payload: IMAPConfig = {
    host: raw.host.trim(),
    port,
    email: raw.email.trim(),
    password: raw.password,
    secure: Boolean(raw.secure),
    displayName: raw.displayName.trim(),
    ...(raw.smtpHost?.trim() && { smtpHost: raw.smtpHost.trim() }),
    ...(smtpPort && !isNaN(smtpPort) && { smtpPort }),
  };

  const res = await axiosInstance.post("/mailboxes/imap", payload);
  return unwrap(res);
};
