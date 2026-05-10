import axiosInstance from "@/lib/axios";

export const downloadAttachment = async (
  mailboxId: string,
  emailId: string,
  attachmentId: string,
): Promise<void> => {
  const url = `${axiosInstance.defaults.baseURL}/mailboxes/${mailboxId}/emails/${emailId}/attachments/${attachmentId}/download`;
  window.open(url, "_blank");
};
