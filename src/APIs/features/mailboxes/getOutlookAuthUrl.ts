import axiosInstance from "@/lib/axios";

export const getOutlookAuthUrl = async (
  redirectUri: string,
): Promise<{ url: string }> => {
  const res = await axiosInstance.get<{
    data?: { url: string };
    url?: string;
    authUrl?: string;
    redirectUrl?: string;
  }>(`/mailboxes/outlook/auth-url`, { params: { redirectUri } });
  const body = res.data;
  const url = body?.data?.url || body?.url || body?.authUrl || body?.redirectUrl;

  if (!url || typeof url !== "string") {
    console.error("Outlook Auth URL Error. Response body:", body);
    throw new Error("Invalid auth URL returned from Outlook endpoint.");
  }
  return { url };
};
