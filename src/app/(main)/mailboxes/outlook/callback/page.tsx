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

    sentRef.current = true;
    const channel = new BroadcastChannel("securemail_oauth_channel");

    if (code) {
      console.log("Outlook Callback: Broadcasting code");
      channel.postMessage({ type: "OAUTH_CODE_RECEIVED", code });
      channel.close();
      finish();
    } else if (error) {
      console.error("Outlook Callback Error:", error);
      channel.postMessage({ type: "OAUTH_ERROR", error });
      channel.close();
      finish();
    } else {
      console.warn("Outlook Callback: No code or error found");
      channel.close();
      finish();
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
