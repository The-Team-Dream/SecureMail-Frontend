import axiosInstance, { baseURL } from "@/lib/axios";
import { AuthMe, OAuthProvider } from "../../types/auth";

export const getOAuthLoginUrl = (
  provider: OAuthProvider,
  redirectUrl?: string,
): string => {
  const providerEndpointMap: Record<OAuthProvider, string> = {
    google: "/auth/google/login",
    outlook: "/auth/outlook/login",
  };

  const base = `${baseURL}${providerEndpointMap[provider]}`;
  if (redirectUrl) {
    return `${base}?redirectUrl=${encodeURIComponent(redirectUrl)}`;
  }
  return base;
};

export const validateOAuthToken = async (token: string) => {
  const res = await axiosInstance.get<AuthMe>("/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
