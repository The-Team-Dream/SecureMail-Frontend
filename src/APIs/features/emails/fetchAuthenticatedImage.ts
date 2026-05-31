import Cookies from "js-cookie";

export const fetchAuthenticatedImage = async (url: string): Promise<string> => {
  const token = Cookies.get("token");
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch image");
  }
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
