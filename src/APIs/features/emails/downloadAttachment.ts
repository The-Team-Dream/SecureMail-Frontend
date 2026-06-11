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
  console.log("Downloading from URL:", url);
  console.log("Using Token:", token);
  const headers: HeadersInit = {
    "Content-Type": `Bearer ${token}`,
  };
  if (token && (!url.startsWith("http") || url.includes("/mailboxes/"))) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Server error:", errorText);
    let message = `Download failed: ${response.status}`;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed.message) {
        message = parsed.message;
      }
    } catch {
      // Fallback if not valid JSON
    }
    throw new Error(message);
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
