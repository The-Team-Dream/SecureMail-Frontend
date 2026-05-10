"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/_components/shared/Text";

export default function GoogleOAuthCallback() {
  const searchParams = useSearchParams();
  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    const code = searchParams.get("code");
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (window.opener) {
      sentRef.current = true;
      if (token) {
        console.log("Google Callback: Sending token to opener");
        window.opener.postMessage({ type: "OAUTH_SUCCESS", token }, "*");
        window.close();
      } else if (code) {
        console.log("Google Callback: Sending code to opener");
        window.opener.postMessage({ type: "OAUTH_CODE_RECEIVED", code }, "*");
        window.close();
      } else if (error) {
        console.error("Google Callback Error:", error);
        window.opener.postMessage({ type: "OAUTH_ERROR", error }, window.location.origin);
        window.close();
      } else {
        console.warn("Google Callback: No code or error found");
        window.close();
      }
    } else {
      console.error("Google Callback: window.opener is null. Cannot send message.");
    }
  }, [searchParams]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <Spinner />
      <Text font="medium" color="primary-950">
        Connecting to Google...
      </Text>
      <Text size="sm" color="primary-500">
        This window will close automatically.
      </Text>
    </div>
  );
}
