import Cookies from "js-cookie";

export const fetchAuthenticatedImage = async (url: string): Promise<string> => {
  if (url.startsWith("http") && !url.includes("/mailboxes/")) {
    return url;
  }
  const token = Cookies.get("token");
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    let message = "Failed to fetch image";
    try {
      const parsed = JSON.parse(errorText);
      if (parsed.message) {
        message = parsed.message;
      }
    } catch {}
    throw new Error(message);
  }
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
