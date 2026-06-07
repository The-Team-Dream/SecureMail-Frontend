import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";

export const useOAuthLogin = (
  options?: UseMutationOptions<string, Error, string>,
) => {
  return useMutation({
    mutationFn: async (token: string) => {
      return token;
    },
    onSuccess: (token) => {
      Cookies.set("token", token, {
        path: "/",
        expires: 1,
      });
      toast.success("Logged in successfully", { id: "oauth-login" });
      window.location.href = "/mailboxes";
    },
    onError: (error: any) => {
      toast.error(error?.message || "OAuth login failed");
    },
    ...options,
  });
};
