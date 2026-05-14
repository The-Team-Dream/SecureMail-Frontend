"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/_components/shared/Text";

export default function OutlookOAuthCallback() {
  const searchParams = useSearchParams();
  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    const finish = () => {
      setTimeout(() => {
        window.close();
      }, 100);
    };

    if (window.opener) {
      sentRef.current = true;
      if (code) {
        console.log("Outlook Callback: Sending code to opener");
        window.opener.postMessage(
          { type: "OAUTH_CODE_RECEIVED", code },
          window.location.origin,
        );
        finish();
      } else if (error) {
        console.error("Outlook Callback Error:", error);
        window.opener.postMessage(
          { type: "OAUTH_ERROR", error },
          window.location.origin,
        );
        finish();
      } else {
        console.warn("Outlook Callback: No code or error found");
        finish();
      }
    } else {
      console.error(
        "Outlook Callback: window.opener is null. Cannot send message.",
      );
    }
  }, [searchParams]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <Spinner />
      <Text font="medium" color="primary-950">
        Connecting to Outlook...
      </Text>
      <Text size="sm" color="primary-500">
        This window will close automatically.
      </Text>
    </div>
  );
}
