"use client";
import { useEffect, useState, useRef } from "react";
import { getOAuthLoginUrl } from "@/APIs/features/auth";
import { SocialAuthButton } from "./SocialAuthButton";
import googleIcon from "../../../public/icons/google.svg";
import logo from "../../../public/icons/logo.png";
import { toast } from "sonner";
import { useOAuthLogin } from "@/APIs/hooks/auth";

const SocialAuthWrapper = () => {
  const [isLoading, setIsLoading] = useState(false);
  const oauthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { mutate: handleOAuthSuccess } = useOAuthLogin();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Robust origin check
      const currentOrigin = window.location.origin;
      if (event.origin !== currentOrigin) return;

      if (event.data?.type === "OAUTH_SUCCESS" && event.data?.token) {
        if (oauthIntervalRef.current) {
          clearInterval(oauthIntervalRef.current);
          oauthIntervalRef.current = null;
        }
        handleOAuthSuccess(event.data.token);
      }
    };

    const channel = new BroadcastChannel("oauth_channel");
    channel.onmessage = (event) => {
      if (event.data?.type === "OAUTH_SUCCESS" && event.data?.token) {
        if (oauthIntervalRef.current) {
          clearInterval(oauthIntervalRef.current);
          oauthIntervalRef.current = null;
        }
        handleOAuthSuccess(event.data.token);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      channel.close();
      if (oauthIntervalRef.current) clearInterval(oauthIntervalRef.current);
    };
  }, [handleOAuthSuccess]);

  const handleOAuthClick = async (provider: "google" | "outlook") => {
    setIsLoading(true);

    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const popup = window.open(
      "about:blank",
      "OAuthLogin",
      `width=${width},height=${height},top=${top},left=${left},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`,
    );

    if (!popup) {
      setIsLoading(false);
      toast.error("Popup blocked. Please allow popups for this site.");
      return;
    }

    // Show a loading message with logo in the popup while waiting for the URL
    popup.document.write(`
      <html>
        <head>
          <title>Connecting...</title>
          <style>
            body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f9fafb; color: #111827; }
            .logo { width: 80px; height: 80px; margin-bottom: 24px; }
            .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #3b82f6; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin-top: 16px; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            h1 { font-size: 24px; font-weight: 800; margin: 0; color: #000; }
          </style>
        </head>
        <body>
          <img src="${logo.src}" class="logo" alt="SecureMail" />
          <h1>SecureMail</h1>
          <div class="spinner"></div>
          <div style="margin-top: 12px; color: #64748b;">Connecting to Provider...</div>
        </body>
      </html>
    `);

    try {
      const origin = window.location.origin;
      const callbackUrl = `${origin}/auth/${provider}/callback`;
      const url = getOAuthLoginUrl(provider, callbackUrl);

      // Update the popup URL immediately
      popup.location.href = url;

      // Start polling to check if the window is closed
      if (oauthIntervalRef.current) clearInterval(oauthIntervalRef.current);
      oauthIntervalRef.current = setInterval(() => {
        if (popup.closed) {
          if (oauthIntervalRef.current) {
            clearInterval(oauthIntervalRef.current);
            oauthIntervalRef.current = null;
          }
          setIsLoading(false);
        }
      }, 1000);
    } catch (error) {
      console.error("OAuth error:", error);
      if (popup) popup.close();
      setIsLoading(false);
    }
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
          isLoading={isLoading}
          onClick={() => handleOAuthClick("google")}
        />
      </div>
    </div>
  );
};

export default SocialAuthWrapper;
