"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOAuthLoginUrl } from "@/APIs/features/auth";
import { SocialAuthButton } from "./SocialAuthButton";
import googleIcon from "../../../public/icons/google.svg";
const SocialAuthWrapper = () => {
  const router = useRouter();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // In a real app, verify the origin here if needed
      if (event.data?.type === "OAUTH_SUCCESS" && event.data?.token) {
        import("js-cookie").then((Cookies) => {
          Cookies.default.set("token", event.data.token, {
            path: "/",
            expires: 1,
          });
          router.push("/mailboxes");
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  const handleOAuthClick = (provider: "google" | "outlook") => {
    const callbackUrl = `${window.location.origin}/auth/google/callback`;
    const url = getOAuthLoginUrl(provider, callbackUrl);

    // Open a popup window centered on the screen
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      url,
      "OAuthLogin",
      `width=${width},height=${height},top=${top},left=${left},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`,
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-primary-200 rounded-xs" />
        <span className="text-center text-primary-500">OR</span>
        <div className="flex-1 h-px bg-primary-200 rounded-xs" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-12">
        <SocialAuthButton
          provider="google"
          title="Google"
          iconSrc={googleIcon}
          onClick={() => handleOAuthClick("google")}
        />
      </div>
    </div>
  );
};

export default SocialAuthWrapper;
