import Cookies from "js-cookie";
import { baseURL } from "@/lib/axios";

export const downloadAttachment = async (
  mailboxId: string,
  emailId: string,
  attachmentId: string,
  filename: string,
): Promise<void> => {
  const token = Cookies.get("token");
  const url = `${baseURL}/mailboxes/${mailboxId}/emails/${emailId}/attachments/${attachmentId}/download`;

  // Build a URL with token as query param for authenticated download
  const fullUrl = token ? `${url}?token=${token}` : url;

  const link = document.createElement("a");
  link.href = fullUrl;
  link.setAttribute("download", filename);
  link.setAttribute("target", "_blank");
  document.body.appendChild(link);
  link.click();
  link.remove();
};

