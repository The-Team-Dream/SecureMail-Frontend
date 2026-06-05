import Cookies from "js-cookie";
import { baseURL } from "@/lib/axios";

export const downloadAttachment = async (
  mailboxId: string,
  emailId: string,
  attachmentId: string,
  filename: string,
  attachmentUrl?: string,
): Promise<void> => {
  const token = Cookies.get("token");
  const url =
    attachmentUrl ||
    `${baseURL}/mailboxes/${mailboxId}/emails/${emailId}/attachments/${attachmentId}/download`;

  const headers: HeadersInit = {};
  if (token && (!url.startsWith("http") || url.includes("/mailboxes/"))) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Download failed");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = objectUrl;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
};
